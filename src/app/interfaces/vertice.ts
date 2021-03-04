export interface IVertice {
    id: number,
    label: string,
    data?: any,
    connections: Array<string>,

    offsetX: number,
    offsetY: number,
    isSelected?: boolean,
    isHighlighted?: boolean,
    selfConnectionCounter: number
}