import { Participation } from "./Participation";
import { YearlyData } from "./YearlyData";

export interface Olympic {  
    id: number; 
    country: string;
    participations: Participation[]
    yearlyData: YearlyData[];

}