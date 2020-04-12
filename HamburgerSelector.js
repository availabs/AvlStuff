import React from "react"

import classnames from "classnames"
import styled from "styled-components"

const StyledTab = styled.div`
  padding: 2px 10px;
  margin-bottom: 5px;
  background-color: ${ props => props.theme.sidePanelHeaderBg };
  color: ${ props => props.theme.textColor };
  &.open {
    color: ${ props => props.theme.textColorHl };
  }
  > div:first-child {
    border-bottom: 2px solid currentColor;
    transition: border-width 0.15s;
  }
  &.closed > div:first-child {
    border-width: 0px;
  }
  &.closed:hover {
    background-color: ${ props => props.theme.panelBackgroundHover };
    color: ${ props => props.theme.textColorHl };
  }
  transition: height 0.5s, background-color 0.15s, color 0.15s;
  :first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  :last-child {
    margin-bottom: 0px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`

export const Tab = ({ label, children, open, showChildren, ...rest }) =>
  <StyledTab { ...rest }
    className={ classnames({ open, showChildren, closed: !open }) }>
    <div>
      { label }
    </div>
    { !showChildren ? null :
      children
    }
  </StyledTab>

export class HamburgerSelector extends React.Component {
  state = {
    curr: 0,
    prev: -1,
    transitioning: false
  }
  render() {
    const num = React.Children.count(this.props.children),
      tabs = React.Children.map(this.props.children, (child, i) => {

        const open = i === this.state.curr,
          trans = this.state.transitioning && (i === this.state.prev);

        return React.cloneElement(child,
          { open,
            showChildren: open || trans,
            onClick: open ? null : e => {
              this.setState({ curr: i, prev: this.state.curr, transitioning: true });
              setTimeout(() => this.setState({ transitioning: false }), 500)
            },
            style: {
              height: open ? `calc(100% - ${ (num - 1) * (24 + 5) }px)` : "24px",
              overflow: this.state.transitioning || !open ? "hidden" : "auto",
              cursor: open ? "auto" : "pointer"
            }
          }
        )
      })
    return (
      <div style={ { height: "100%", width: "100%" } }>
        { tabs }
      </div>
    )
  }
}
