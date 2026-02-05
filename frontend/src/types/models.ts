
export interface BaseModel {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Project extends BaseModel {
    name: string;
    description?: string;
    status: ProjectStatus;
    progress: number;
    areaId?: string;
}

export interface Area extends BaseModel {
    name: string;
    coverImage?: string;
    description?: string;
}

export interface Task extends BaseModel {
    title: string;
    status: 'todo' | 'doing' | 'done';
    projectId?: string;
}

export type ResourceType = 'link' | 'note' | 'document';

export interface Resource extends BaseModel {
    title: string;
    type: ResourceType;
    url?: string;
    content?: string;
    context?: string;
    projectId?: string;
    areaId?: string;
    status?: 'inbox' | 'processed' | 'archived';
    tags?: string[];
}

export type HabitFrequency = 'daily' | 'weekly';

export interface Habit extends BaseModel {
    name: string;
    frequency: HabitFrequency;
    completedDates: string[];
    areaId?: string;
    currentStreak?: number;
    maxStreak?: number;
    status?: 'active' | 'paused' | 'archived';
}

export interface Metric extends BaseModel {
    name: string;
    type: string;
}

export interface Log extends BaseModel {
    date: string;
    action: string;
    value?: string;
    metricId?: string;
    habitId?: string;
    timestamp?: number;
    details?: string; // For note content or JSON metadata
}

export interface User extends BaseModel {
    name: string;
    email: string;
    avatarUrl?: string;
    plan?: 'free' | 'pro' | 'founder';
}
