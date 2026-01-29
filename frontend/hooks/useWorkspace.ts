import { useEffect, useState } from 'react';

export interface WorkspaceLayout {
  id: string;
  name: string;
  description?: string;
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      config: Record<string, any>;
    }>;
    theme?: string;
    sidebarOpen?: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'prophetbase-workspaces';
const ACTIVE_WORKSPACE_KEY = 'prophetbase-active-workspace';

export function useWorkspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceLayout[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load workspaces from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
    
    if (stored) {
      try {
        setWorkspaces(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse workspaces:', e);
      }
    }
    
    if (activeId) {
      setActiveWorkspaceId(activeId);
    }
  }, []);

  // Save workspaces to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
  }, [workspaces, mounted]);

  // Save active workspace ID
  useEffect(() => {
    if (!mounted) return;
    if (activeWorkspaceId) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspaceId);
    } else {
      localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
    }
  }, [activeWorkspaceId, mounted]);

  const createWorkspace = (name: string, description?: string) => {
    const newWorkspace: WorkspaceLayout = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      layout: {
        widgets: [],
        sidebarOpen: true,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
    return newWorkspace;
  };

  const updateWorkspace = (id: string, updates: Partial<WorkspaceLayout>) => {
    setWorkspaces((prev) =>
      prev.map((workspace) =>
        workspace.id === id
          ? { ...workspace, ...updates, updatedAt: Date.now() }
          : workspace
      )
    );
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id));
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(null);
    }
  };

  const duplicateWorkspace = (id: string) => {
    const workspace = workspaces.find((w) => w.id === id);
    if (!workspace) return null;

    const duplicate: WorkspaceLayout = {
      ...workspace,
      id: `workspace-${Date.now()}`,
      name: `${workspace.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setWorkspaces((prev) => [...prev, duplicate]);
    return duplicate;
  };

  const exportWorkspace = (id: string) => {
    const workspace = workspaces.find((w) => w.id === id);
    if (!workspace) return;

    const dataStr = JSON.stringify(workspace, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workspace.name.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importWorkspace = (file: File) => {
    return new Promise<WorkspaceLayout>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workspace = JSON.parse(e.target?.result as string) as WorkspaceLayout;
          workspace.id = `workspace-${Date.now()}`;
          workspace.createdAt = Date.now();
          workspace.updatedAt = Date.now();
          
          setWorkspaces((prev) => [...prev, workspace]);
          resolve(workspace);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    exportWorkspace,
    importWorkspace,
    mounted,
  };
}
