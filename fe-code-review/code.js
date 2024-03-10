app.post("/api/extract", upload.single("file"), async (req, res) => {
  logInfo("POST /api/extract", req.body);
  logInfo("FILE=", req.file);

  if (req.body) {
    const file = req.file;
    const requestID = req.body.requestID;
    const project = req.body.project;
    const idUser = req.body.userID;
    //Code-review: Here You can use destructuring such as const { requestID, project, idUser } = req.body
    //Code-review: Here You could create a middleware for validating data and separate validator logic from domain logic
    const user = await User.findOne(idUser);
    //Code-review: seems like You are calling entity what shouldn happen inside controller, You can call it inside service or repository

    if (requestID && project && idUser && user) {
      // You could create a small helper such as: const isRequestOk = requestID && project && idUser && user; and use it here:if (isRequestOk) {}
      // Code review Comment: Read about Return Early Pattern - so You could avoid Arrow anti-pattern and improve readability (and developer experience)
      // - in oreder to do that You can reverse this if statement: to if (!requestID || !project || !userID)  and return error

      logDebug("User with role " + user.role, user);
      // here you can use template string: logDebug(`User with role ${user.role}`, user);
      if (user.role === "ADVISOR" || user.role.indexOf("ADVISOR") > -1)
        // Also You are messing with statements. You can change it into something more readable, like:
        // const userRole = user.role;
        // const isUserAdvisor = userRole === "ADVISOR" || (Array.isArray(userRole) && userRole.includes("ADVISOR"))
        // and use it: if (isUserAdvisor){}

        // Code review Comment: this could be a part of another component: Guard or some Access/Role Middleware
        return res.json({
          requestID,
          step: 999,
          status: "DONE",
          message: "Nothing to do for ADVISOR role",
        });
      /* reset status variables */
      await db.updateStatus(requestID, 1, "");
      // Code review Comment: what if it will fail? Maybe You could use some error catching?
      // Code review Comment: You should not call database inside the cotroller nor in domain logic.
      // COde Review Comment: Hopefully its some Repository or DAO (etc) pattern, You should commmunicate with that from DOMAIN layer (some service, useCase etc)

      logDebug("CONFIG:", config.projects);
      if (
        project === "inkasso" &&
        config.projects.hasOwnProperty(project) &&
        file
      ) {
        //Code review Comment: here You start with some domain logic: You could create some file service or file factory - please read about those patterns and think about implementation

        const hashSum = crypto.createHash("sha256");
        // Code review Comment: unused variable
        const fileHash = idUser;
        const fileName = "fullmakt";
        const fileType = mime.getExtension(file.mimetype);
        if (fileType !== "pdf")
          return (
            res
              .status(500)
              // Code review Comment: Probably it should be status code 400 since the file type is invalid
              .json({ requestID, message: "Missing pdf file" })
          );
        await db.updateStatus(requestID, 3, "");
        //Code review comment: ---> line 38

        const folder = `${project}-signed/${idUser}`;
        logDebug("FILE2=", file);
        await uploadToGCSExact(
          folder,
          fileHash,
          fileName,
          fileType,
          file.mimetype,
          file.buffer
        );
        // Code review comment: Here You are using a lot of arguments and its easy to mess them up, I would reccomend You to change it to use named arguments instead of positional arguments
        // example: uploadToGCSExact({folder,fileHash ,fileName,fileType, mimetype: file.mimetype, buffer:  file.buffer})
        await db.updateStatus(requestID, 4, "");
        //Code review comment: ---> line 38
        const ret = await db.updateUploadedDocs(
          idUser,
          requestID,
          fileName,
          fileType,
          file.buffer
        );
        logDebug("DB UPLOAD:", ret);

        await db.updateStatus(requestID, 5, "");
        //Code review Comment: Below You are starting with ANOTER responsibility for this single function
        let sent = true;
        // Code review Comment: unused variable
        const debtCollectors = await db.getDebtCollectors();
        logDebug("debtCollectors=", debtCollectors);
        if (!debtCollectors)
          return res
            .status(500)
            .json({ requestID, message: "Failed to get debt collectors" });
        // Code review comments: I am not sure if I would want users to get as direct error messages, They dont need to know system specifics
        //Code review Comment: If You would separate domain logic: This should be a part of Error Handler in some http layer, in the domain logic, you should simply throw a ready-to-use error

        if (!!(await db.hasUserRequestKey(idUser))) {
          //FIX: check age, not only if there's a request or not
          return res.json({
            requestID,
            step: 999,
            status: "DONE",
            message: "Emails already sent",
          });
        }

        const sentStatus = {};
        for (let i = 0; i < debtCollectors.length; i++) {
          await db.updateStatus(requestID, 10 + i, "");
          //Code Review Comment: this will fail, if You want to iterate with async operation, one after another, you can use:
          //  for (let i = 0; i < debtCollectors.length; i++) {
          // If You want to speed up and database performance will let you, You can use: await Promise.all(debtCollectors.map( d => { ... } ))
          const idCollector = debtCollectors[i].id;
          const collectorName = debtCollectors[i].name;
          const collectorEmail = debtCollectors[i].email;
          const hashSum = crypto.createHash("sha256");
          const hashInput = `${idUser}-${idCollector}-${new Date().toISOString()}`;
          logDebug("hashInput=", hashInput);
          hashSum.update(hashInput);
          const requestKey = hashSum.digest("hex");
          logDebug("REQUEST KEY:", requestKey);

          const hash = Buffer.from(
            `${idUser}__${idCollector}`,
            "utf8"
          ).toString("base64");

          if (
            !!(await db.setUserRequestKey(requestKey, idUser)) &&
            !!(await db.setUserCollectorRequestKey(
              requestKey,
              idUser,
              idCollector
            ))
          ) {
            /* prepare email */
            const sendConfig = {
              sender: config.projects[project].email.sender,
              replyTo: config.projects[project].email.replyTo,
              subject: "Email subject",
              templateId: config.projects[project].email.template.collector,
              params: {
                downloadUrl: `https://url.go/download?requestKey=${requestKey}&hash=${hash}`,
                uploadUrl: `https://url.go/upload?requestKey=${requestKey}&hash=${hash}`,
                confirmUrl: `https://url.go/confirm?requestKey=${requestKey}&hash=${hash}`,
              },
              tags: ["request"],
              to: [{ email: collectorEmail, name: collectorName }],
            };
            // Code review comments: You can consider using optional chaining for safety, like:  config.projects[project]?.email.sender and so on...,
            logDebug("Send config:", sendConfig);

            try {
              await db.setEmailLog({
                collectorEmail,
                idCollector,
                idUser,
                requestKey,
              });
            } catch (e) {
              logDebug("extract() setEmailLog error=", e);
            }

            /* send email */
            const resp = await email.send(
              sendConfig,
              config.projects[project].email.apiKey
            );
            logDebug("extract() resp=", resp);

            // update DB with result
            await db.setUserCollectorRequestKeyRes(
              requestKey,
              idUser,
              idCollector,
              resp
            );

            if (!sentStatus[collectorName]) sentStatus[collectorName] = {};
            //Code review Comment: seems like a code smell - the next line will always be called since You missed statement body braceletes:
            sentStatus[collectorName][collectorEmail] = resp;

            if (!resp) {
              logError("extract() Sending email failed: ", resp);
            }
          }
        }
        await db.updateStatus(requestID, 100, "");

        logDebug("FINAL SENT STATUS:");
        console.dir(sentStatus, { depth: null });

        // Code review: Be cautious when using console.dir with depth set to null as it may output large nested structures, which could make it difficult to analyze the data effectively. Consider limiting the depth parameter for better readability and understanding of the object's structure.

        //if (!allSent)
        //return res.status(500).json({requestID, message: 'Failed sending email'});
        //CODE review comment: If code is important to use, uncomment id, if it's not used - just remove it, dont leave it its causing a mess

        await db.updateStatus(requestID, 500, "");

        /* prepare summary email */
        const summaryConfig = {
          //bcc: [{ email: 'tomas@inkassoregisteret.com', name: 'Tomas' }],
          sender: config.projects[project].email.sender,
          replyTo: config.projects[project].email.replyTo,
          subject: "Oppsummering Kravsforespørsel",
          templateId: config.projects[project].email.template.summary,
          params: {
            collectors: sentStatus,
          },
          tags: ["summary"],
          to: [{ email: "tomas@upscore.no", name: "Tomas" }], // FIXXX: config.projects[project].email.sender
        };
        logDebug("Summary config:", summaryConfig);

        /* send email */
        //const respSummary = await email.send(sendConfig, config.projects[project].email.apiKey);
        //logDebug('extract() summary resp=', respSummary);

        //CODE review comment: If code is important to use, uncomment id, if it's not used - just remove it, dont leave it its causing a mess

        await db.updateStatus(requestID, 900, "");
      }
      await db.updateStatus(requestID, 999, "");
      return res.json({
        requestID,
        step: 999,
        status: "DONE",
        message: "Done sending emails...",
      });
    } else
      return res.status(500).json({
        //Code review: this status code doesnt fit to the validation error
        requestID,
        message: "Missing requried input (requestID, project, file)",
      });
  }
  res
    //Code review: You missed a return here
    .status(500)
    //Code review: this status code doesnt fit to the validation error
    .json({ requestID: "", message: "Missing requried input (form data)" });
});

/*Code Review Comment:
  I've tried to add some helpful comments for You among the code lines,
  Hovewer I need to summarize All I want You to think About:
  1. First of all this single function has a lot of responsibilities - You should focus on splitting code into some smaller pices with small goals
  2. You messed some Acess Logic, validation logic, controller logic and domain logic together - split the code thinking about layers of the Application. 
  - across the code review I tried to let You know where You should move the logic - so You could create some new compoenents and separate different app layers logic.
  3. This code is totally context-free and This-less. You could think about OOP  and transform code into classes and modules. 
  The code wouldnt be this messy, would be easier to read and track and would improve developer experience
  4. Once You split it into classes with single responsibility You should think about SOLID principles 
  - You can use some DI and reverse the depndencies tree. 
  - so Your code will be clean and You will reduce risk of legacy code and probably will extend the code's life cycle
  5. Name convention: names should be deccriptive so no one would misunderstand the logic under the hood
  6. Code should be self-explanatory - Mostly You shouldnt use comments in purpouse to explain code workflow
  - You shouldnt also comment code fragements: as I told earlier in the comment.
  7. DRY - Some repetitions can be observed in the code, such as updating the request status (`db.updateStatus`) in different parts of the function. 
  - Consider extracting these parts into separate helper functions to reduce repetitions and improve code readability.
  8. Adding error handling can facilitate debugging and code improvement. 
  - Ensure that each function handles possible errors and returns appropriate HTTP status codes and error messages.
  9. Make sure Async actions are wrapped with try/catch or You provode some error catching
  10. Summary: After You provide changes, check if You can answer these questions when reading the file:
  - what is the communication between compoenents? Do You know the directions of communication and its purposes?
  - what is a flow of current compoenent?
  - what is a result of current component?
  - what context does current compoenent have?

  WHDYT about my propositons?
  These are only suggestions - let me know if you need any explanation or help in refactoring that code - I would be happy to do that :) 
  */
