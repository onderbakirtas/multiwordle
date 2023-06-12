export type TTileState = "initial" | "correct" | "present" | "absent";

export type TLetterState = {
  [key: string]: TTileState;
};

export type TToast = {
  id?: number;
  message?: string;
};
