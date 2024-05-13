import { DataSeries } from "./DataSeries";

export interface ChartOptions {
  animationEnabled: boolean;
  title: {
    text: string;
  };
  data: DataSeries[];
}
