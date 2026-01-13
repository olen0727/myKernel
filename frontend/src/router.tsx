import { createBrowserRouter, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import DashboardPage from "@/pages/DashboardPage"
import InboxPage from "@/pages/InboxPage"
import ProjectListPage from "@/pages/ProjectListPage"
import ProjectDetailPage from "@/pages/ProjectDetailPage"
import AreaListPage from "@/pages/AreaListPage"
import AreaDetailPage from "@/pages/AreaDetailPage"
import ResourceLibraryPage from "@/pages/ResourceLibraryPage"
import ResourceEditorPage from "@/pages/ResourceEditorPage"
import JournalPage from "@/pages/JournalPage"
import MetricsPage from "@/pages/MetricsPage"
import SettingsPage from "@/pages/SettingsPage"
import LoginPage from "@/pages/LoginPage"
import NotFoundPage from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "inbox",
                element: <InboxPage />,
            },
            {
                path: "projects",
                children: [
                    { index: true, element: <ProjectListPage /> },
                    { path: ":id", element: <ProjectDetailPage /> },
                ]
            },
            {
                path: "areas",
                children: [
                    { index: true, element: <AreaListPage /> },
                    { path: ":id", element: <AreaDetailPage /> },
                ]
            },
            {
                path: "resources",
                children: [
                    { index: true, element: <ResourceLibraryPage /> },
                    { path: ":id", element: <ResourceEditorPage /> },
                ]
            },
            {
                path: "journal",
                children: [
                    { index: true, element: <JournalPage /> },
                    { path: ":date", element: <JournalPage /> },
                ]
            },
            {
                path: "metrics",
                element: <MetricsPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    }
])
