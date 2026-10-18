declare module 'd3-selection' {
  export interface D3SelectionLike {
    call(fn: unknown, ...args: unknown[]): D3SelectionLike;
    on(name: string, listener: unknown): D3SelectionLike;
  }

  export function select(target: EventTarget | null | undefined): D3SelectionLike;
}

declare module 'd3-zoom' {
  export interface D3ZoomBehaviorLike {
    extent(value: unknown): D3ZoomBehaviorLike;
    translateExtent(value: unknown): D3ZoomBehaviorLike;
    scaleExtent(value: [number, number]): D3ZoomBehaviorLike;
    filter(value: unknown): D3ZoomBehaviorLike;
    on(name: string, listener: unknown): D3ZoomBehaviorLike;
    transform: unknown;
    scaleBy: unknown;
  }

  export interface D3ZoomIdentityLike {
    translate(x: number, y: number): {
      scale(k: number): unknown;
    };
  }

  export const zoomIdentity: D3ZoomIdentityLike;
  export function zoom(): D3ZoomBehaviorLike;
}
