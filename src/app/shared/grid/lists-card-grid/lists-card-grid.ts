import { Component, input } from '@angular/core';
import { TopicListCard } from "../../cards/topic-list-card/topic-list-card";
import { TopicList } from '../../../core/models/topiclist.model';

@Component({
  selector: 'app-lists-card-grid',
  imports: [TopicListCard],
  templateUrl: './lists-card-grid.html',
  styleUrl: './lists-card-grid.scss',
})
export class ListsCardGrid {
  topics = input<TopicList[] | null>(null)
}
