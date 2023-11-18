import { ServerRespond } from './DataStreamer';

//Updated to match schema in Graph.tsx.
//Have to add the tracked attributes as this determines the structure of the object generated from generateRow function.
//Returning object has to match the schema of the table in Graph.
export interface Row {
   price_abc: number,
   price_def: number,
   ratio: number,
   timestamp: Date
   upper_bound: number,
   lower_bound: number,
   trigger_alert: number | undefined,
}


//We have to update the manipulator to properly process the raw server data we are receiving.
//Have to compute price_abc and price_def and compute a ratio using both prices as well.
//Then set lower_bound, upper_bound and determine the trigger_alert.
export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
  //Same way we calculated in Task 1, get the ask price + the bid price and divide by 2 to get the price avg.
  const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
  const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
  //ratio will be one divided by the other of course
  const ratio = priceABC / priceDEF;
  const upperBound = 1 + 0.10;
  const lowerBound = 1 - 0.05;
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
}
  }

