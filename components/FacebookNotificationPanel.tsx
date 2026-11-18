import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  MessageSquare, 
  Trash2, 
  MoreHorizontal, 
  Sparkles,
  Ticket,
  ExternalLink
} from 'lucide-react';
import { Task, TaskPriority } from '../types/taskTypes';
import { formatDateDDMMYYYY } from '../services/taskService';

export interface NotificationItem {
  id: string;
  type: 'ticket_created' | 'ticket_assigned' | 'ticket_completed' | 'ticket_urgent' | 'system_alert';
  title: string;
  subtitle: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  avatarText?: string;
  avatarBg?: string;
  priority?: TaskPriority;
  task?: Task;
}

interface FacebookNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  readIds: string[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectTask: (task: Task) => void;
  isLight?: boolean;
}

export const FacebookNotificationPanel: React.FC<FacebookNotificationPanelProps> = ({
  isOpen,
  onClose,
  tasks,
  readIds,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectTask,
  isLight = false
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  // Build Facebook-like activity notifications from live tasks
  const notifications: NotificationItem[] = tasks.map(task => {
    const isCompleted = task.status === 'Completed';
    const isAssigned = Boolean(task.assignedTo && task.assignedTo !== 'Unassigned');
    const isUrgent = task.priorityInCustomer === 'Urgent' || task.priorityInCustomer === 'High';

    let type: NotificationItem['type'] = 'ticket_created';
    let title = `${task.partyName} raised ticket ${task.ticketNumber}`;
    let subtitle = task.descriptionOfWork || `${task.systemName} • ${task.typeOfWork}`;

    if (isCompleted) {
      type = 'ticket_completed';
      title = `Ticket ${task.ticketNumber} marked Resolved`;
      subtitle = task.completionRemark ? `Remark: ${task.completionRemark}` : `Resolved for ${task.partyName}`;
    } else if (isAssigned) {
      type = 'ticket_assigned';
      title = `${task.assignedTo} assigned to ${task.ticketNumber}`;
      subtitle = `${task.partyName} • ${task.systemName}`;
    } else if (isUrgent) {
      type = 'ticket_urgent';
      title = `High priority ticket ${task.ticketNumber} needs action`;
      subtitle = `${task.partyName}: ${task.descriptionOfWork || task.systemName}`;
    }

    const companyInitials = (task.partyName || 'ZC')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return {
      id: task.id,
      type,
      title,
      subtitle,
      timestamp: task.createdAt || task.updatedAt || 'Recently',
      timeAgo: formatDateDDMMYYYY(task.createdAt || task.updatedAt) || 'Today',
      isRead: readIds.includes(task.id),
      avatarText: companyInitials,
      priority: task.priorityInCustomer,
      task
    };
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Facebook Style Popover Dropdown Card */}
      <div 
        className={`fixed top-14 sm:top-16 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[420px] max-h-[85vh] sm:max-h-[640px] flex flex-col rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.35)] z-[65] border overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all ${
          isLight 
            ? 'bg-white border-[#EDE2D3] text-[#1C1E21]' 
            : 'bg-[#242526] border-[#3E4042] text-[#E4E6EB]'
        }`}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header (FB Style: Title + Filter Tabs + Mark all read) */}
        <div className={`p-4 sm:p-4.5 border-b shrink-0 ${
          isLight ? 'border-[#F0EBE1] bg-white' : 'border-[#393A3B] bg-[#242526]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-black tracking-tight ${isLight ? 'text-[#050505]' : 'text-[#E4E6EB]'}`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  title="Mark all as read"
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isLight 
                      ? 'text-[#1877F2] hover:bg-[#E7F3FF]' 
                      : 'text-[#4599FF] hover:bg-white/10'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isLight 
                    ? 'hover:bg-[#F2F2F2] text-[#65676B]' 
                    : 'hover:bg-[#3A3B3C] text-[#B0B3B8]'
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Facebook Dual Segment Tabs: All / Unread */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? isLight
                    ? 'bg-[#E7F3FF] text-[#1877F2] shadow-xs'
                    : 'bg-[#2D88FF]/20 text-[#4599FF]'
                  : isLight
                    ? 'text-[#65676B] hover:bg-[#F2F2F2]'
                    : 'text-[#B0B3B8] hover:bg-[#3A3B3C]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === 'unread'
                  ? isLight
                    ? 'bg-[#E7F3FF] text-[#1877F2] shadow-xs'
                    : 'bg-[#2D88FF]/20 text-[#4599FF]'
                  : isLight
                    ? 'text-[#65676B] hover:bg-[#F2F2F2]'
                    : 'text-[#B0B3B8] hover:bg-[#3A3B3C]'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#1877F2]' : 'bg-[#4599FF]'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Facebook Notification Items Scrollable Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-inherit">
          {filteredNotifications.length === 0 ? (
            <div className="py-14 px-6 text-center space-y-2">
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
                isLight ? 'bg-[#F0F2F5] text-[#65676B]' : 'bg-[#3A3B3C] text-[#B0B3B8]'
              }`}>
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <p className={`text-sm font-bold ${isLight ? 'text-[#050505]' : 'text-white'}`}>
                {filter === 'unread' ? 'No unread notifications' : 'No notifications right now'}
              </p>
              <p className={`text-xs ${isLight ? 'text-[#65676B]' : 'text-[#B0B3B8]'}`}>
                When tickets are raised, assigned, or closed, you’ll see them here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              // Icon Badge overlay on Avatar (like FB comment/like badge)
              let BadgeIcon = Ticket;
              let badgeBg = 'bg-blue-600 text-white';

              if (item.type === 'ticket_completed') {
                BadgeIcon = CheckCircle2;
                badgeBg = 'bg-emerald-500 text-white';
              } else if (item.type === 'ticket_assigned') {
                BadgeIcon = UserCheck;
                badgeBg = 'bg-indigo-600 text-white';
              } else if (item.type === 'ticket_urgent') {
                BadgeIcon = AlertTriangle;
                badgeBg = 'bg-red-500 text-white';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onMarkAsRead(item.id);
                    if (item.task) onSelectTask(item.task);
                    onClose();
                  }}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                    !item.isRead
                      ? isLight
                        ? 'bg-[#E7F3FF]/45 hover:bg-[#E7F3FF]/70'
                        : 'bg-[#2D88FF]/10 hover:bg-[#2D88FF]/18'
                      : isLight
                        ? 'hover:bg-[#F2F2F2]'
                        : 'hover:bg-[#3A3B3C]/50'
                  }`}
                >
                  {/* Facebook Style Avatar with Bottom-Right Floating Type Badge */}
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${
                      isLight 
                        ? 'bg-gradient-to-br from-[#EA552E] to-[#D9481F] text-white' 
                        : 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
                    }`}>
                      {item.avatarText}
                    </div>

                    {/* Floating FB Action Badge */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ring-2 ${
                      isLight ? 'ring-white' : 'ring-[#242526]'
                    } ${badgeBg}`}>
                      <BadgeIcon className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className={`text-xs leading-snug ${
                      !item.isRead ? 'font-black' : 'font-semibold'
                    } ${isLight ? 'text-[#050505]' : 'text-[#E4E6EB]'}`}>
                      {item.title}
                    </p>

                    <p className={`text-xs line-clamp-2 mt-0.5 leading-relaxed ${
                      isLight ? 'text-[#65676B]' : 'text-[#B0B3B8]'
                    }`}>
                      {item.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-semibold ${
                        !item.isRead
                          ? isLight ? 'text-[#1877F2]' : 'text-[#4599FF]'
                          : isLight ? 'text-[#65676B]' : 'text-[#8A8D91]'
                      }`}>
                        {item.timeAgo}
                      </span>

                      {item.priority && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          item.priority === 'Urgent' 
                            ? 'bg-red-500/15 text-red-500' 
                            : item.priority === 'High' 
                              ? 'bg-amber-500/15 text-amber-500' 
                              : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread Blue Dot (FB Style) */}
                  {!item.isRead && (
                    <div className="shrink-0 self-center">
                      <span className={`w-3 h-3 rounded-full block shadow-sm ${
                        isLight ? 'bg-[#1877F2]' : 'bg-[#4599FF]'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer (FB Style Quick Action) */}
        <div className={`p-3 border-t text-center shrink-0 ${
          isLight ? 'border-[#F0EBE1] bg-[#F7F8FA]' : 'border-[#393A3B] bg-[#18191A]'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto ${
              isLight ? 'text-[#1877F2] hover:underline' : 'text-[#4599FF] hover:underline'
            }`}
          >
            <span>Close Notification Panel</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FacebookNotificationPanel;
