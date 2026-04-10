import { Component, input } from '@angular/core';

@Component({
  selector: 'app-topic-list-card',
  imports: [],
  templateUrl: './topic-list-card.html',
  styleUrl: './topic-list-card.scss',
})
export class TopicListCard {
  title = input("Título");
  items = input<string[]>(["Item", "Item", "Item"]);
}
