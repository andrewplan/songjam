
function audioService() {
    let currentDuration;
    let currentWaveformWidth;
    this.setCurrentDuration = ( duration ) => {
        currentDuration = duration;
    }

    this.getCurrentDuration = () => {
        return duration;
    }
    this.setCurrentWaveformWidth = ( waveformWidth ) => {
        currentWaveformWidth = waveformWidth;
    }

    this.getCurrentWaveformWidth = () => {
        return currentWaveformWidth;
    }

}

export default audioService;
