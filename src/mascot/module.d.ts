export interface MascotApi {
  setColors(ink: string, paper: string): void
  destroy(): void
}

export function mountMascot(): MascotApi
