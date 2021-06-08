/**
 * Behaviour.
 */

(function(globals) {

    'use strict';

    // Pseudo–constants:
    var SUCCESS_STATUS = 'success';
    var PARTIALS_PREFIX = 'data/';
    var PARTIALS_DEFINITION_PREFIX = PARTIALS_PREFIX + 'definition/';
    var PARTIALS_ENTITY_PREFIX = PARTIALS_PREFIX + 'entity/';
    var PARTIALS_SUFFIX = '.json';
    var CHECKER_LAPSE = 500;
    var FORM_PREFIX = 'pf-';
    var TYPE_IMAGE = 'image';
    var TYPE_STRING = 'string';
    var TYPE_BOOLEAN = 'boolean';
    var TYPE_INT = 'int';
    var TYPE_FLOAT = 'float';
    var TYPE_LONG_STRING = 'long-string';
    var VARIABLE_REGEX = /\$[a-z][a-z_0-9]*/gi;

    // Global variables:
    var totalRequests;
    var successfulRequests;
    var failedRequests;
    var checker;
    var partials;
    var product;
    var dependencies;
    var nodes;

    $(document).ready(function() {

        $('ul.dropdown-menu > li > a').click(function() {
            $(this).tab('show');
        });

        // $('li[id^=\'sample\']').click(function() {
        $('li.example').click(function() {

            init();

            $('#statusIcon').removeClass()
                .addClass('glyphicon glyphicon-cloud-download');
            $('#statusText').html('Fetching partials&hellip;');
            $('#status').removeClass('hidden');

            // $('li[id^=\'sample\']').removeClass('active');
            $('li.example').removeClass('active');
            $(this).addClass('active');
            $('h2#ui-title > small').html($('> a', this).html());

            fetchObject(this.id, loadProduct);

        });

    });

    var init = function() {

        totalRequests = 0;
        successfulRequests = 0;
        failedRequests = 0;
        checker = null;
        partials = {};
        product = {};
        dependencies = {};
        nodes = {};

        $('#sources').addClass('hidden')
            .empty();
        $('#sources-title > small').empty();
        $('#ui').addClass('hidden')
            .find('> div > form').empty();
        $('#ui-title > small').empty();
        $('#result').addClass('hidden')
            .find('> div').empty();

    };

    /**
     * Retrieve and return an object given its unique ID.
     */

    var fetchObject = function(id, callback) {

        if (id && 'string' === typeof id) {
            totalRequests++;

            $.getJSON(PARTIALS_DEFINITION_PREFIX + id + PARTIALS_SUFFIX, function(data, textStatus) {

                if (SUCCESS_STATUS === textStatus) {
                    callback(data);
                } else {
                    failedRequests++;
                }

            });

        }

    };

    var loadProduct = function(prod) {

        successfulRequests++;
        product = prod;
        showSource(prod);
        checker = window.setInterval(waitForPartials, CHECKER_LAPSE);
        preprocessObject(product);

    };

    var waitForPartials = function() {

        if (successfulRequests + failedRequests === totalRequests) {
            window.clearInterval(checker);

            $('#status > #statusIcon', status).removeClass()
                .addClass('glyphicon glyphicon-cog');
            $('#status > #statusText', status).html('Processing data&hellip;');

            buildProduct(product);

            $('#status > #statusIcon', status).removeClass()
                .addClass('glyphicon glyphicon-pencil');
            $('#status > #statusText', status).html('Building UI&hellip;');

            buildDependencies();
            renderProduct();
            // console.debug(totalRequests + ', ' + finishedRequests);
            // console.debug(product);

        }

    };

    var preprocessObject = function(object) {

        if (object && object.include && is_array(object.include)) {

            for (var id in object.include) {
                fetchObject(object.include[id], function(dependency) {

                    successfulRequests++;
                    showSource(dependency);
                    partials[dependency.id] = dependency;
                    preprocessObject(dependency);

                });
            }

        }

    };

    var buildProduct = function(object) {

        if (object && object.include && is_array(object.include)) {

            for (var i = 0; i < object.include.length; i++) {
                var partial = partials[object.include[i]];

                if (partial &&
                    partial.version &&
                    'string' === typeof partial.version &&
                    object.version &&
                    'string' === typeof object.version &&
                    object.version === partial.version) {
                    buildProduct(partial);
                    extendObject(object, partial);
                }

            }

        }

    };

    var showSource = function(json) {

        $('#sources').removeClass('hidden');

        var newSource = $('#sourceSegment').clone();

        $(newSource).attr('id', 'source-' + json.id);
        $('h3 > a', newSource).attr('data-parent', '#sources')
            .attr('href', '#json-' + json.id)
            .find('> span.monospace').html(PARTIALS_DEFINITION_PREFIX + json.id + PARTIALS_SUFFIX);
        $('> div:odd', newSource).attr('id', 'json-' + json.id);
        $('div > div', newSource).html('<pre>' + JSON.stringify(json, null, 2) + '</pre>');
        $('#sources > div > div').removeClass('in');
        $('h2#sources-title > small').html(successfulRequests + (successfulRequests > 1 ? ' partials' : ' partial'));
        $('#sources').append(newSource);

        /*var Highlight = require('highlight');
	var html = require('highlight-xml');
	var js = require('highlight-javascript');
	var json = require('highlight-json');

	var highlight = new Highlight()
		// .use(html)
		// .use(js);
		.use(json);

	var el = document.querySelector('#sources');
	highlight.element(el);*/

        /*var hl = new Highlight();
	hl.use(json);
	hl.highlight('#sources');*/

    }

    var extendObject = function(base) {

        for (var i = 1; i < arguments.length; i++) {
            var extension = arguments[i];

            if (extension &&
                extension.version &&
                'string' === typeof extension.version &&
                base &&
                base.version &&
                'string' === typeof base.version &&
                base.version === extension.version) {

                if (extension.constants && is_array(extension.constants)) {

                    if (base.constants && is_array(base.constants)) {
                        base.constants = base.constants.concat(extension.constants);
                    } else {
                        base.constants = extension.constants;
                    }

                }

                if (extension.content && is_array(extension.content)) {

                    if (base.content && is_array(base.content)) {
                        base.content = base.content.concat(extension.content);
                    } else {
                        base.content = extension.content;
                    }

                }

            }

        }

    }

    var buildDependencies = function() {

        for (var fieldName in product.content) {
            var field = product.content[fieldName];

            dependencies[field.id] = [];
            nodes[field.id] = field;
        }

        for (var fieldName in product.content) {
            var field = product.content[fieldName];

            if (field.output && field.value) {
                var matches = field.value.match(VARIABLE_REGEX);

                if (is_array(matches) && matches.length > 0) {

                    for (var term in matches) {
                        var id = matches[term].substr(1);

                        if (is_array(dependencies[id])) {

                            if (0 === dependencies[id].length) {
                                dependencies[id] = [field.id];
                            } else {
                                var i = 0;

                                while (i < dependencies[id].length && field.id !== dependencies[id][i]) {
                                    i++;
                                }

                                if (i >= dependencies[id].length) {
                                    dependencies[id][dependencies[id].length] = field.id;
                                }

                            }

                        }

                    }

                }

            }

        }

        // console.debug(dependencies);	

    }

    var renderProduct = function() {

        // console.debug(successfulRequests);
        $('#ui').removeClass('hidden');
        // $('#result').removeClass('hidden');
        $('#ui > div > form').empty();

        for (var constant in product.constants) {
            var formGroup = $('<div class="form-group"><label for="' + product.constants[constant].id +
                '" class="col-sm-3 control-label">' + product.constants[constant].id +
                // '</label><div class="col-sm-9"><input type="text" class="form-control" id="' + product.constants[constant].id +
                // '" value="' + product.constants[constant].value + '" readonly></div></div>');
                '</label><div class="col-sm-9"><span id="' + product.constants[constant].id +
                '">' + product.constants[constant].value + '</span></div></div>');
            // console.debug(formGroup);
            formGroup.appendTo('#ui > div > form');
        }

        for (var fieldName in product.content) {
            var field = product.content[fieldName];
            var formGroup;

            if (TYPE_STRING === field.type) {
                field.value = field.value || '';
                formGroup = $('<div class="form-group"><label for="' + FORM_PREFIX + field.id +
                    '" class="col-sm-4 control-label">' + field.label +
                    '</label><div class="col-sm-8"><input type="text" class="form-control" id="' + FORM_PREFIX + field.id +
                    '" value="' + field.value + '" /></div></div>');
            } else if (TYPE_LONG_STRING === field.type) {
                field.value = field.value || '';
                formGroup = $('<div class="form-group"><label for="' + FORM_PREFIX + field.id +
                    '" class="col-sm-4 control-label">' + field.label +
                    '</label><div class="col-sm-8"><textarea rows="4" class="form-control" id="' + FORM_PREFIX + field.id +
                    '" value="' + field.value + '"></textarea></div></div>');
            } else if (TYPE_BOOLEAN === field.type) {
                formGroup = $('<div class="form-group"><div class="col-sm-8 col-sm-offset-4"><div class="checkbox"><label><input type="checkbox" id="' +
                    FORM_PREFIX + field.id + '" ' + (field.value ? 'checked ' : '') + '/>' + field.label + '</label></div></div></div>');
            } else if (TYPE_FLOAT === field.type || TYPE_INT === field.type) {
                // field.value = field.value || NaN;
                var input = $('<input type="number" class="form-control" id="' + FORM_PREFIX + field.id +
                    '" value="' + field.value + '">');

                if (field.hasOwnProperty('editable') && !(field.editable)) {
                    input.attr('readonly', true);
                    input.attr('data-value', input.attr('value'));
                }

                formGroup = $('<div class="form-group"><label for="' + FORM_PREFIX + field.id +
                    '" class="col-sm-4 control-label">' + field.label +
                    '</label><div class="col-sm-4"></div></div>');
                input.appendTo(formGroup.find('> div:even'));

            } else if (TYPE_IMAGE === field.type) {
                formGroup = $('<div class="form-group"><div class="col-sm-12 text-center"><img src="' + field.url + ' " alt="' + field.label + '" /></div>');
            }

            if (formGroup) {
                formGroup.appendTo('#ui > div > form');
                $('#' + FORM_PREFIX + field.id).change(runUI); // focusout(runUI);
            }

        }

        $('#ui > div > form > div:first > div > input').focus();

    }

    var runUI = function() {

        var nodeId = $(this).attr('id');

        if (nodeId) {
            var id = nodeId.substr(FORM_PREFIX.length);

            if (id) {
                var dependants = dependencies[id];

                if (dependants && dependants.length > 1) {

                    for (var i = 0; i < dependants.length; i++) {
                        var expression = $('#' + FORM_PREFIX + nodes[dependants[i]].id).attr('data-value');
                        // console.debug(expression);
                        var matches = expression.match(VARIABLE_REGEX);

                        if (is_array(matches) && matches.length > 0) {

                            for (var term in matches) {

                                if (expression.match(VARIABLE_REGEX)) {
                                    var id = matches[term].substr(1);
                                    var node = $('#' + FORM_PREFIX + id);

                                    if (node) {
                                        var value = '(' + $(node).val().toString() + ')';
                                        expression = expression.replace(matches[term], value, 'gi');

                                        if (is_array(dependencies[id])) {
                                            // console.debug('dependant: ' + dependants[i] + '; id: ' + id);
                                        }

                                    }

                                }

                            }

                            var finalValue = eval(expression);

                            if (finalValue) {
                                // console.debug(dependants[i] + ': ' + finalValue);
                                $('#' + FORM_PREFIX + nodes[dependants[i]].id).val(finalValue);
                            }
                        }

                        // console.debug(expression);
                    }

                }

            }

        }

        for (var fieldName in product.content) {
            var field = product.content[fieldName];
            var node = $('#' + FORM_PREFIX + field.id);

            if (node) {

                if (TYPE_STRING === field.type) {
                    field.value = node.val();
                } else if (TYPE_LONG_STRING === field.type) {
                    field.value = node.val();
                } else if (TYPE_BOOLEAN === field.type) {
                    field.value = $(node).is(':checked');
                } else if (TYPE_FLOAT === field.type || TYPE_INT === field.type) {
                    field.value = node.val();
                }

            }

            if (node.hasOwnProperty('editable') && !(node.editable)) {
                // console.debug(dependencies);
            }

        }

        $('#result > div').html('<pre>' + JSON.stringify(product, null, 2) + '</pre>');
        $('#result').removeClass('hidden');

    }

    /**
     * From Douglas Crockford's “JavaScript: The Good Parts”.
     */

    var is_array = function(value) {

        return value &&
            'object' === typeof value &&
            'number' === typeof value.length &&
            'function' === typeof value.splice && !(value.propertyIsEnumerable('length'));

    };

}(this));

// EOF