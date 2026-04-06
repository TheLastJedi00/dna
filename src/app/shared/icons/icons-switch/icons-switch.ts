import { Component, input } from '@angular/core';
import { Heart } from '../heart/heart';
import { Shield } from '../shield/shield';
import { Bolt } from '../bolt/bolt';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { ChartPie } from '../chart-pie/chart-pie';
import { Pencil } from '../pencil/pencil';
import { Users } from '../users/users';
import { Flag } from '../flag/flag';
import { UserCircle } from '../user-circle/user-circle';

@Component({
  selector: 'app-icons-switch',
  imports: [Heart, Shield, Bolt, ChatBubble, ChartPie, Pencil, Users, Flag, UserCircle],
  templateUrl: './icons-switch.html',
  styleUrl: './icons-switch.scss',
})
export class IconsSwitch {
  icon = input('heart');
}
