export interface DataPoint {
    y: number;
    label: string;
    id?: string;
    click?: (e: any) => void; 
  }

