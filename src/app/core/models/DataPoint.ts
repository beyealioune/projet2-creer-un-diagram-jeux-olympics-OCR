export interface DataPoint {
    y: number;
    label: string;
    id?: string;
    click?: (e: MouseEvent) => void; 
  }

