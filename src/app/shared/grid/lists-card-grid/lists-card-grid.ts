import { Component, input } from '@angular/core';
import { TopicListCard } from "../../cards/topic-list-card/topic-list-card";
import { Topic } from '../../../core/models/supply.model';

@Component({
  selector: 'app-lists-card-grid',
  imports: [TopicListCard],
  templateUrl: './lists-card-grid.html',
  styleUrl: './lists-card-grid.scss',
})
export class ListsCardGrid {
  topics = input<Topic[] | null>(null)
}
