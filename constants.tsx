
import { View, ExpenseCategory, ReviewPlatform } from './types';
import type { ReactElement } from 'react';

const Icon = ({ path, className }: { path: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export const ICONS = {
    CHART: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm-4 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2zM15 5v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2zM15 19v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    USERS: <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />,
    BRIEFCASE: <Icon path="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v7a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4h4v1H8V4z" />,
    ARROWS: <Icon path="M7 7h10v2H7V7zm0 4h7v2H7v-2zm0 4h3v2H7v-2zM4 6a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1z" />,
    ASSISTANT: <Icon path="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />,
    REVENUE: <Icon path="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />,
    EXPENSE: <Icon path="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />,
    PROFIT: <Icon path="M9 17v-2.25A1.75 1.75 0 007.25 13H5.5A2.5 2.5 0 013 10.5V8.75A1.75 1.75 0 001.25 7H1a1 1 0 010-2h.25A1.75 1.75 0 003 6.75V5.5A2.5 2.5 0 015.5 3h1.75A1.75 1.75 0 009 1.25V1a1 1 0 112 0v.25A1.75 1.75 0 0012.75 3h1.75A2.5 2.5 0 0117 5.5v1.25A1.75 1.75 0 0018.75 8H19a1 1 0 110 2h-.25A1.75 1.75 0 0017 11.25V12.5a2.5 2.5 0 01-2.5 2.5h-1.75A1.75 1.75 0 0011 16.75V19a1 1 0 11-2 0z" />,
    PROJECTS_ACTIVE: <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    SOFTWARE: <Icon path="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v10h10V5H5z" />,
    MARKETING: <Icon path="M17.657 9.343a1 1 0 01-1.414 0L13 6.09l-3.243 3.253a1 1 0 01-1.414 0L5.343 6.343a1 1 0 011.414-1.414L10 8.086l3.243-3.253a1 1 0 011.414 0l3 3zM4 14v-2a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1z" />,
    OFFICE: <Icon path="M6 4h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v10h8V6H6z" />,
    MEALS: <Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 9.668a6 6 0 117.336 0L10 12.332l-2.668-2.664z" />,
    TRAVEL: <Icon path="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />,
    OTHER: <Icon path="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />,
    TAX: <Icon path="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M11 12a1 1 0 100 2h2a1 1 0 100-2h-2z M5.52 6.64l4.95 2.83-4.95 2.83a1 1 0 01-1.04-1.74l2.87-1.64-2.87-1.65a1 1 0 111.04-1.73zM15 15a3 3 0 11-6 0 3 3 0 016 0z" />,
    SETTINGS: <Icon path="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106-.54-.886-.061-2.042.947-2.287 1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />,
    EMAIL: <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />,
    CHAT: <Icon path="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" className="h-5 w-5" />,
    BULB: <Icon path="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM17.707 9.293a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM13.828 13H6.172a1 1 0 00-1 1 4 4 0 004 4 4 4 0 004-4 1 1 0 00-1-1zM6.343 4.343a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM4.293 9.293a1 1 0 101.414 1.414l.707.707a1 1 0 10-1.414-1.414l-.707-.707z" />,
    MAGIC: <Icon path="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />,
    COPY: <Icon path="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />,
    STAR: <Icon path="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />,
    GLOBE: <Icon path="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z M12 2.066V10h8.026A8.006 8.006 0 0012 2.066z" />
};

export const NAVIGATION_ITEMS = [
  { id: View.Dashboard, label: 'Dashboard', icon: ICONS.CHART },
  { id: View.Clients, label: 'Clients', icon: ICONS.USERS },
  { id: View.Projects, label: 'Projects', icon: ICONS.BRIEFCASE },
  { id: View.Transactions, label: 'Transactions', icon: ICONS.ARROWS },
  { id: View.Reviews, label: 'Reviews', icon: ICONS.STAR },
  { id: View.Community, label: 'Community', icon: ICONS.GLOBE },
  { id: View.Tax, label: 'Tax Estimator', icon: ICONS.EXPENSE },
  { id: View.Assistant, label: 'Assistant', icon: ICONS.ASSISTANT },
  { id: View.Settings, label: 'Settings', icon: ICONS.SETTINGS },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'cat-software', name: 'Software & Subscriptions', icon: ICONS.SOFTWARE },
  { id: 'cat-marketing', name: 'Marketing & Advertising', icon: ICONS.MARKETING },
  { id: 'cat-office', name: 'Office Supplies', icon: ICONS.OFFICE },
  { id: 'cat-meals', name: 'Meals & Entertainment', icon: ICONS.MEALS },
  { id: 'cat-travel', name: 'Travel', icon: ICONS.TRAVEL },
  { id: 'cat-other', name: 'Other', icon: ICONS.OTHER },
];

export const DEFAULT_REVIEW_PLATFORMS: ReviewPlatform[] = [
    { id: 'google', name: 'Google Reviews', url: '', isActive: true },
    { id: 'hellopeter', name: 'HelloPeter', url: '', isActive: true },
    { id: 'facebook', name: 'Facebook Reviews', url: '', isActive: true },
    { id: 'tripadvisor', name: 'TripAdvisor', url: '', isActive: false },
];
