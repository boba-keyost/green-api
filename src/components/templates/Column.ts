import classNames from "classnames";
import Component, {type CommonProps, type CommonState} from "~/components/Component";

import classes from "./Column.module.pcss"


export type ColumnState = CommonState
export type ColumnProps = CommonProps & {
    header?: string
}

export default class Column extends Component<ColumnProps, ColumnState, HTMLDivElement>{
    renderElement(): HTMLDivElement {
        const col = document.createElement('div')
        col.className = classNames(this.props.className, classes.column)
        if (this.props.header) {
            const header = document.createElement('h2')
            header.className = classes.header
            header.innerText = this.props.header
            col.appendChild(header)
        }
        return col
    }
}