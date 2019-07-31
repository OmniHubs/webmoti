var zoomMin = null;
var zoomMax = null;
var zoomStep = null;
var zoomValue = null;
var track = null;
function initZoom(mediaStream)
{
  console.log("Attaching zoom!");
  track = mediaStream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  // Check whether zoom is supported or not.
  if (!('zoom' in capabilities)) {
    return Promise.reject('Zoom is not supported by ' + track.label);
  }

  // Map zoom to a slider element.
  zoomMin = capabilities.zoom.min;
  zoomMax = capabilities.zoom.max;
  zoomStep = capabilities.zoom.step;
  zoomValue = settings.zoom;

}
function zoomIn(steps)
{
  var zoomCalc = zoomValue +(zoomStep*steps);
  track.applyConstraints({advanced: [ {zoom: zoomCalc} ]}).catch(error => {console.log(error)});
}
function zoomOut(steps)
{
  var zoomCalc = zoomValue - (zoomStep*steps);
  track.applyConstraints({advanced: [ {zoom: zoomCalc} ]}).catch(error => {console.log(error)});
}


