import React from 'react'
import './index.css'

const keyUp = { 38: 1, 33: 1 }
const keyDown = { 40: 1, 34: 1 }

export default class SliderPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSlide: 1
    }
    this.sliderRef = React.createRef()
    this.touchStartPos = 0
    this.touchStopPos = 0
    this.touchMinLength = 50
  }

  componentDidMount() {
    this.detectChangeEnd() &&
      this.sliderRef.current.addEventListener(this.detectChangeEnd(), this.onTransition)
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    this.sliderRef.current.removeEventListener(this.detectChangeEnd(), this.onTransition)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  onTransition = () => {
    if (this.isChanging) {
      setTimeout(() => {
        this.isChanging = false
        window.location.hash = document.querySelector(
          '[data-slider-index="' + this.state.currentSlide + '"]'
        ).id
      }, 400)
    }
  }

  detectChangeEnd = () => {
    var transition
    var e = document.createElement('foobar')
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }

    for (transition in transitions) {
      if (e.style[transition] !== undefined) {
        return transitions[transition]
      }
    }
    return true
  }

  onKeyDown = e => {
    if (keyUp[e.keyCode]) {
      this.changeSlide(-1)
    } else if (keyDown[e.keyCode]) {
      this.changeSlide(1)
    }
  }

  onMouseWheel = e => {
    const direction = e.wheelDelta || e.deltaY
    if (direction > 0) {
      this.changeSlide(-1)
    } else {
      this.changeSlide(1)
    }
  }

  onTouchStart = e => {
    e.preventDefault()
    if (
      e.type === 'touchstart' ||
      e.type === 'touchmove' ||
      e.type === 'touchend' ||
      e.type === 'touchcancel'
    ) {
      var touch = e.touches[0] || e.changedTouches[0]
      this.touchStartPos = touch.pageY
    }
  }

  onTouchEnd = e => {
    e.preventDefault()
    if (
      e.type === 'touchstart' ||
      e.type === 'touchmove' ||
      e.type === 'touchend' ||
      e.type === 'touchcancel'
    ) {
      var touch = e.touches[0] || e.changedTouches[0]
      this.touchStopPos = touch.pageY
    }
    if (this.touchStartPos + this.touchMinLength < this.touchStopPos) {
      this.changeSlide(-1)
    } else if (this.touchStartPos > this.touchStopPos + this.touchMinLength) {
      this.changeSlide(1)
    }
  }

  modifyChildren = (child, index) => {
    const className = `${child.props.className ? `${child.props.className} ` : ''}slider__page`

    const props = {
      className,
      'data-slider-index': index + 1
    }

    return React.cloneElement(child, props)
  }

  changeSlide = direction => {
    // already doing it or last/first page, staph plz
    if (
      this.isChanging ||
      (direction === 1 && this.state.currentSlide === this.props.children.length) ||
      (direction === -1 && this.state.currentSlide === 1)
    ) {
      return
    }

    // change page
    this.setState({
      currentSlide: this.state.currentSlide + direction
    })
    this.isChanging = true
  }

  render() {
    const sliderIndicators = (
      <div className="slider__indicators">
        {this.props.children.map((_, index) => {
          return (
            <div
              key={index}
              className={`slider__indicator${
                this.state.currentSlide === index + 1 ? ' slider__indicator--active' : ''
              }`}
              data-slider-target-index={index + 1}
            />
          )
        })}
      </div>
    )

    return (
      <>
        <div
          ref={this.sliderRef}
          className="slides slider__container"
          style={{
            transform: `translate3d(0, ${-(this.state.currentSlide - 1) * 100}%, 0)`
          }}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onWheel={this.onMouseWheel}
        >
          {React.Children.map(this.props.children, (child, index) =>
            this.modifyChildren(child, index)
          )}
        </div>
        {sliderIndicators}
      </>
    )
  }
}
