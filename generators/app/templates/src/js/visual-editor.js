(function (leesa, HY) {
    leesa.util = {
        uniqueId: function () {
            return HY.Utility.guid();
        }
    }
})(namespace("leesa"), HY);

var intervalDelay = 100;

function initialize(name, viewports) {
    var observable = ko.observable;
    var visual = leesa.visual[name];

    initializeViewports(viewports);
    initializeVisuals();
    initializeEvents();
    renderVisuals(visual, viewports);

}

function initializeViewports(viewports) {
    var visualEditorElement = $(".visual-editor");
    for (var i = 0; i < viewports.length; i++) {
        var viewport = viewports[i];
        var viewportElement = $("<div class='visual resizeable'></div>");
        viewportElement.css("width", viewport.width);
        viewportElement.css("height", viewport.height);
        viewportElement.appendTo(visualEditorElement);
        viewport.context = {
            visualElement: viewportElement
        }
    }
}

function initializeVisuals() {
    var visuals = $(".visual");
    for (var i = 0; i < visuals.length; i++) {
        var visual = $(visuals[i]);
        var visualContainer = $("<div class='visual-container'></div>");
        var sizeIndicator = $("<div class='size-indicator'></div>");
        visualContainer.appendTo(visual);
        sizeIndicator.appendTo(visual);
    }
}

function initializeEvents() {

    var containers = $(".visual");
    var containerArray = [];
    var sizeIndicatorArray = [];
    var lastWidth = [];
    var lastHeight = [];
    for (var i = 0; i < containers.length; i++) {
        var container = $(containers[i]);
        containerArray.push(container);
        var sizeIndicator = $(container.find(".size-indicator"));
        sizeIndicatorArray.push(sizeIndicator);
    }
    var sizeIndicators = $(".size-indicator");
    setInterval(function () {
        for (var i = 0; i < containerArray.length; i++) {
            var width = containerArray[i].width();
            var height = containerArray[i].height();
            if (lastWidth[i] != width || lastHeight[i] != height) {
                var text = width + " x " + height;
                sizeIndicatorArray[i].html(text);
                lastWidth[i] = width;
                lastHeight[i] = height;
            }
        }
    }, intervalDelay);
}

function renderVisuals(visualPack, viewports) {

    for (var i = 0; i < viewports.length; i++) {
        var viewport = viewports[i]
        var quadrant = generateQuadrant();
        var container = viewport.context.visualElement;
        var parameters = {};
        $.extend(parameters, viewport.parameters, {
            __viewport: i
        })
        var visual = {
            parameters: parameters || {},
        }
        quadrant.visual(visual);
        quadrant.data(viewport.data);
        quadrant.htmlJContent(container);
        visualPack.render(quadrant, function () { });
    }
}

function generateQuadrant() {
    var observable = ko.observable;
    return {
        htmlJContent: observable(),
        visual: observable({

        }),
        data: observable({

        })
    }
}