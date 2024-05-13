import { DataPoint } from "./DataPoint";

export interface DataSeries {
  type: string;
  startAngle?: number;
  indexLabel?: string;
  yValueFormatString?: string;
  toolTipContent?: string;
  dataPoints: DataPoint[];
}


  