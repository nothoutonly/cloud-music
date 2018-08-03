<template>
	<div class="progress-circle">
		<svg :width="radius"
		     :height="radius"
		     viewBox="0 0 100 100"
		     version="1.1"
		     xmlns="http://www.w3.org/2000/svg">
			<circle class="progress-background"
			        r="50"
			        cx="50"
			        cy="50"
			        fill="transparent"
			        troke-linecap="round" />
			<circle class="progress-bar"
			        r="50"
			        cx="50"
			        cy="50"
			        fill="transparent"
			        troke-linecap="round"
			        :stroke-dasharray="dasharray"
			        :stroke-dashoffset="dashoffset" />
		</svg>
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		radius: {
			type: Number,
			default: 100,
		},
		percent: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			dasharray: Math.PI * 100,
		}
	},
	computed: {
		dashoffset() {
			return (1 - this.percent) * this.dasharray
		},
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.progress-circle {
	position: relative;

	circle {
		stroke-width: 6px;
		transform-origin: center;

		&.progress-background {
			transform: scale(0.9);
			stroke: $color-text-sub;
		}

		&.progress-bar {
			transform: scale(0.9) rotate(-90deg);
			stroke: $color-theme;
		}
	}
}
</style>