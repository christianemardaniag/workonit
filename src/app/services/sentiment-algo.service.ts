import { Injectable } from '@angular/core';
import * as Sentiment from 'sentiment';

@Injectable({
  providedIn: 'root'
})
export class SentimentAlgoService {

  constructor() { }
  private sentiment = new Sentiment();

  analyze(text: any): string {
    const result = this.sentiment.analyze(text);
    
    if (result.score > 0) {
      return 'Positive';
    } else if (result.score < 0) {
      return 'Negative';
    } else {
      return 'neutral';
    }
  }
}
