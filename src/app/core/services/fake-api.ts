import { Injectable } from '@angular/core';
import { TopicList } from '../models/topiclist.model';

@Injectable({
  providedIn: 'root',
})
export class FakeApi {
  getAllTopicLists(): TopicList[] {
    return [
        {
          titulo: 'Lorem Ipsum Dolor',
          items: [
            'Consectetur adipiscing',
            'Eiusmod tempor',
            'Incididunt ut labore',
            'Dolore magna aliqua',
            'Ut enim ad minim',
            'Quis nostrud exercitation',
            'Ullamco laboris nisi',
            'Ut aliquip ex ea',
            'Commodo consequat',
            'Duis aute irure',
          ],
        },
        {
          titulo: 'Sit Amet Consectetur',
          items: [
            'Reprehenderit in voluptate',
            'Velit esse cillum',
            'Dolore eu fugiat',
            'Nulla pariatur',
            'Excepteur sint occaecat',
            'Cupidatat non proident',
            'Sunt in culpa qui',
            'Officia deserunt mollit',
            'Anim id est laborum',
            'Perspiciatis unde omnis',
          ],
        },
        {
          titulo: 'Iste Natus Error',
          items: [
            'Voluptatem accusantium',
            'Doloremque laudantium',
            'Totam rem aperiam',
            'Eaque ipsa quae',
            'Ab illo inventore',
            'Veritatis et quasi',
            'Architecto beatae vitae',
            'Dicta sunt explicabo',
            'Nemo enim ipsam',
            'Voluptatem quia voluptas',
          ],
        },
        {
          titulo: 'Aspernatur Aut Odit',
          items: [
            'Aut fugit sed quia',
            'Magni dolores eos',
            'Qui ratione voluptatem',
            'Sequi nesciunt neque',
            'Porro quisquam est',
            'Qui dolorem ipsum',
            'Quia dolor sit amet',
            'Consectetur adipisci velit',
            'Sed quia non numquam',
            'Eius modi tempora',
          ],
        },
        {
          titulo: 'Incidunt Ut Labore',
          items: [
            'Magnam aliquam quaerat',
            'Voluptatem ut enim',
            'Ad minima veniam',
            'Quis nostrum exercitationem',
            'Ullam corporis suscipit',
            'Laboriosam nisi ut',
            'Aliquid ex ea commodi',
            'Consequatur autem vel',
            'Iure reprehenderit qui',
            'In ea voluptate velit',
          ],
        },
      ];
  }
}
