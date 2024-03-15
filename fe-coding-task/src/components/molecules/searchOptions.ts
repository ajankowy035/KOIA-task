export type SearchOptions = {
  value: string;
  label: string;
};

const getSearchYears = (min: number, max: number): number[] => {
  const result: number[] = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
};

export const quartalsOptions: SearchOptions[] = [
  { value: "k1", label: "Q1" },
  { value: "k2", label: "Q2" },
  { value: "k3", label: "Q3" },
  { value: "k4", label: "Q4" },
];

export const searchOptions: SearchOptions[] = getSearchYears(2009, 2023)
  .map((item: number) => {
    return quartalsOptions.map((q) => ({
      value: `${item}${q.value}`,
      label: `${q.label} ${item}`,
    }));
  })
  .flat();
