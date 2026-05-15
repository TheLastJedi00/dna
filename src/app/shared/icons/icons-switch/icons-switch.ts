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
import { MagnifyingGlass } from "../magnifying-glass/magnifying-glass";
import { ArrowsRightLeft } from "../arrows-right-left/arrows-right-left";
import { LockClosed } from "../lock-closed/lock-closed";
import { LockOpen } from "../lock-open/lock-open";
import { ArrowsPointingOut } from "../arrows-pointing-out/arrows-pointing-out";
import { ArrowLeft } from '../arrow-left/arrow-left';
import { ChevronDown } from "../chevron-down/chevron-down";
import { Plus } from "../plus/plus";
import { Sparkles } from "../sparkles/sparkles";

@Component({
  selector: 'app-icons-switch',
  imports: [Heart, Shield, Bolt, ChatBubble, ChartPie, Pencil, Users, Flag, UserCircle, MagnifyingGlass, ArrowsRightLeft, LockClosed, LockOpen, ArrowsPointingOut, ArrowLeft, ChevronDown, Plus, Sparkles],
  templateUrl: './icons-switch.html',
  styleUrl: './icons-switch.scss',
})
export class IconsSwitch {
  icon = input('heart');
}
