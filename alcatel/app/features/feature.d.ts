type Granularity = "seconds" | "minutes" | "hours";

type Callback<T> = (data: T) => void;

interface Feature<T, U = {}> {
  initialize(callback: Callback<T>, options: U | undefined): void;
}
