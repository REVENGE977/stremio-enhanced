export const VALID_RENDERERS = ["auto", "d3d11", "d3d9", "gl", "vulkan", "software"] as const;
export type Renderer = typeof VALID_RENDERERS[number];