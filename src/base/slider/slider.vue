<template>
	<div class="slider"
	     ref="slider">
		<div class="slider-group"
		     ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot"
			      v-for="(item, index) in dots"
			      :key="index"
			      :class="{'active' : currentPageIndex === index}"></span>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
	name: 'slider',
	props: {
		// 循环轮播
		loop: {
			type: Boolean,
			default: true,
		},
		// 自动轮播
		autoPlay: {
			type: Boolean,
			default: true,
		},
		// 轮播interval
		interval: {
			type: Number,
			default: 4000,
		},
	},
	data() {
		return {
			dots: [],
			currentPageIndex: 0,
		}
	},
	mounted() {
		setTimeout(() => {
			this._setSliderWidth(false)
			this._initDots()
			this._initSlider()
			if (this.autoPlay) {
				this._play()
			}
		}, 20)

		window.addEventListener('resize', () => {
			if (!this.slider) {
				return
			}
			this._setSliderWidth(true)
			this.slider.refresh()
		})
	},
	activated() {
		if (this.autoPlay) {
			this._play()
		}
	},
	deactivated() {
		clearTimeout(this.timer)
	},
	beforeDestroy() {
		clearTimeout(this.timer)
	},
	methods: {
		_setSliderWidth(isResize) {
			this.children = [...this.$refs.sliderGroup.children]
			let width = 0
			let sliderWidth = this.$refs.slider.clientWidth
			this.children.forEach(child => {
				addClass(child, 'slider-item')
				child.style.width = sliderWidth + 'px'
				width += sliderWidth
			})

			if (this.loop && !isResize) {
				width += 2 * sliderWidth
			}
			this.$refs.sliderGroup.style.width = width + 'px'
		},
		_initSlider() {
			this.slider = new BScroll(this.$refs.slider, {
				scrollX: true,
				snap: {
					loop: this.loop,
					threshold: 0.3,
					speed: 400,
				},
				bounce: false,
				stopPropagation: true,
				click: true,
			})
			this.slider.on('scrollEnd', this._onScrollEnd)
			this.slider.on('beforeScrollStart', () => {
				if (this.autoPlay) {
					clearTimeout(this.timer)
				}
			})
		},
		_onScrollEnd() {
			let pageIndex = this.slider.getCurrentPage().pageX
			if (this.loop) {
				pageIndex -= 1
			}
			this.currentPageIndex = pageIndex

			if (this.autoPlay) {
				this._play()
			}
		},
		_initDots() {
			this.dots = new Array(this.children.length)
		},
		_play() {
			let pageIndex = this.currentPageIndex + 1
			if (this.loop) {
				pageIndex += 1
			}
			this.timer = setTimeout(() => {
				this.slider.goToPage(pageIndex, 0, 400)
			}, this.interval)
		},
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.slider {
	min-width: 1px;
	height: 100%;

	.slider-group {
		position: relative;
		overflow: hidden;
		white-space: nowrap;

		.slider-item {
			float: left;
			box-sizing: border-box;
			overflow: hidden;

			img {
				width: 100%;
				display: block;
			}
		}
	}

	.dots {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 12px;
		text-align: center;

		.dot {
			display: inline-block;
			margin: 0 3px;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: $color-background;

			&.active {
				background: $color-highlight-background;
			}
		}
	}
}
</style>
