import React from "react"

import get from "lodash.get";

class Text extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
    text: "",
    style: {}
  }
  ref = React.createRef();
  componentDidMount() {
    if (this.ref.current) {
      const { width, height } = this.ref.current.getBoundingClientRect();
      this.props.report({ width, height }, this.props.id);
    }
  }
  render() {
    return (
      <text ref={ this.ref }
        x={ this.props.x }
        y={ this.props.y }
        style={ this.props.style }>
        { this.props.text }
      </text>
    )
  }
}

export default class SvgTextBox extends React.Component {
  static defaultProps = {
    x: 0,
    y: 0,
    padding: 0,
    onUpdate: (height, width) => {},
    hSpace: 2,
    vSpace: 2,
    text: "",
    style: {}
  }
  ref = React.createRef();
  state = {
    bboxes: {},
    maxLineHeight: 0,
    width: 0,
    height: 0
  }
  componentDidUpdate() {
    if (this.ref.current) {
      const {
          top,
          right,
          bottom,
          left
        } = this.getPadding(),

        bbox = this.ref.current.getBoundingClientRect(),

        width = bbox.width + left + right,
        height = bbox.height + top + bottom + this.state.maxLineHeight * 0.5;

      if ((width !== this.state.width) || (height !== this.state.height)) {
        this.setState({
          width: width,
          height: height
        })
        this.props.onUpdate(height, width);
      }
    }
  }
  report(bbox, id) {
    this.setState(state => {
      return {
        bboxes: {
          ...state.bboxes,
          [id]: bbox
        },
        maxLineHeight: Math.max(state.maxLineHeight, bbox.height)
      }
    })
  }
  getPadding() {
    let padding = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
    if (typeof this.props.padding === "number") {
      padding.top = this.props.padding;
      padding.right = this.props.padding;
      padding.bottom = this.props.padding;
      padding.left = this.props.padding;
    }
    else if (typeof this.props.padding === "object") {
      padding = {
        ...padding,
        ...this.props.padding
      }
    }
    return padding;
  }
  render() {
    let x = 0, y = 0,
      firstLineH = 0, passedFirstLine = false,
      maxLineH = 0;

    const {
        top,
        right,
        // bottom,
        left
      } = this.getPadding(),

      width = this.props.width - (right + left),

      TEXT = this.props.text.split(/\s+/)
        .filter(Boolean)
        .map((t, i) => {
          const id = `${ t }-${ i }`,
            w = get(this.state, ["bboxes", id, "width"], 0),
            h = get(this.state, ["bboxes", id, "height"], 0);

          maxLineH = Math.max(h, maxLineH);
          if (!passedFirstLine) firstLineH = maxLineH;

          if ((x + w + this.props.hSpace) > width) {
            passedFirstLine = true;
            x = 0;
            y += maxLineH + this.props.vSpace;
            maxLineH = 0;
          }

          const temp = (
            <Text key={ id } id={ id }
              text={ t } x={ x } y={ y }
              report={ this.report.bind(this) }
              style={ this.props.style }/>
          );

          x += (w + this.props.hSpace);

          return temp;
        })

    return (
      <g ref={ this.ref }
        style={ {
          transform: `translate(${ this.props.x + left }px, ${ this.props.y + top + firstLineH }px)`
        } }>
        { TEXT }
      </g>
    )
  }
}
