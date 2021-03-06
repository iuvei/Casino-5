﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __slice = [].slice;

  define(function(require) {
    var GridRendering, coffeeScript, config, shell;
    this.ko.bindingHandlers["grid"] = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var columns, options;
        options = (ko.utils.unwrapObservable(valueAccessor))();
        columns = [];
        $("column", element).each(function() {
          var attr, column, _i, _len, _ref;
          column = {
            template: this.innerHTML
          };
          _ref = this.attributes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            column[attr.name] = attr.value;
          }
          return columns.push(column);
        });
        return GridRendering.render(element, columns, options, viewModel, bindingContext);
      }
    };
    window.findGrid = function(container) {
      var grid, gridSelector;
      container = container || window;
      gridSelector = "[data-bind^='grid:']";
      grid = $(container).find(gridSelector).addBack(gridSelector).last();
      if (grid.length === 0) {
        grid = $(container).closest(gridSelector);
      }
      return grid;
    };
    coffeeScript = require("coffee-script");
    shell = require("shell");
    config = require("config");
    return GridRendering = (function() {
      function GridRendering() {}

      GridRendering.render = function(element, columns, options, viewModel) {
        var additionalData, column, data, field, filterData, filters, header, index, isArray, jqGridParams, operator, pager, rules, table, treeclick, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          column = columns[_i];
          column.name = column.name || column["sort-field"] || column.value || "column_" + Math.random().toString().substr(2);
        }
        $(element).append(table = $("<table>", {
          id: "table_" + Math.random().toString().substr(2)
        })).prepend(header = $("<div>", {
          id: table[0].id + "-jqgrid-title-bar",
          "class": "jqgrid-title-bar"
        }));
        if (Array.isArray(ko.unwrap(options.source))) {
          data = $(element)[0].gridData = ko.unwrap(options.source);
          if (options.source.subscribe != null) {
            options.source.subscribe(function() {
              $(element)[0].gridData = ko.unwrap(options.source);
              return $(element).trigger("reload");
            });
          }
        }
        $("header", element).children().each(function() {
          return $(this).appendTo(header);
        });
        $("header, column", element).remove();
        if (options.paging != null) {
          if (options.paging === true) {
            options.paging = {};
          }
          $(element).append(pager = $("<div>", {
            id: "pager_" + Math.random().toString().substr(2)
          }));
        }
        jqGridParams = {
          colNames: (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = columns.length; _j < _len1; _j++) {
              column = columns[_j];
              _results.push(this.columnTitle(column.title || column.value || ""));
            }
            return _results;
          }).call(this),
          colModel: (function() {
            var _j, _len1, _results;
            _results = [];
            for (index = _j = 0, _len1 = columns.length; _j < _len1; index = ++_j) {
              column = columns[index];
              _results.push(((function(_this) {
                return function(column, index) {
                  return {
                    name: column.name,
                    index: column.name,
                    formatter: _this.columnFormatter(column, data, viewModel, options),
                    width: column.width || "",
                    hidden: (column.hidden != null) || (element.hiddenColumns != null) && ~element.hiddenColumns.indexOf(column.name),
                    sortable: column["sort-field"] != null
                  };
                };
              })(this))(column, index));
            }
            return _results;
          }).call(this),
          datatype: "json",
          autowidth: true,
          shrinkToFit: false,
          ignoreCase: true,
          sortable: true,
          columnReordering: true,
          footerrow: false,
          userDataOnFooter: false,
          search: (options.filter != null) || (element.filters != null),
          height: "auto",
          viewrecords: true,
          pager: options.paging != null ? pager[0].id : void 0,
          rowNum: options.paging != null ? ((_ref = options.paging) != null ? _ref.records : void 0) || 10 : void 0,
          rowList: options.paging != null ? ((_ref1 = options.paging) != null ? _ref1.options : void 0) || [10, 20, 30, 40, 50, 100] : void 0,
          url: data == null ? options.source : void 0,
          loadComplete: function(tableData) {
            var id, row, rows, _j, _len1, _results;
            id = table.jqGrid("getGridParam", "selrow");
            $(element).trigger("gridLoad", {
              id: id,
              data: table.getRowData(id),
              tableData: tableData
            });
            rows = table[0].rows;
            _results = [];
            for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
              row = rows[_j];
              ko.cleanNode(row);
              _results.push(ko.applyBindings(viewModel, row));
            }
            return _results;
          },
          onSelectRow: function(id, isSelected, event) {
            return $(element).trigger("selectionChange", {
              id: id,
              data: table.getRowData(id),
              isSelected: isSelected,
              event: event
            });
          }
        };
        if (options.loadDataOnStart == null) {
          options.loadDataOnStart = true;
        }
        if (options.loadDataOnStart && (data != null)) {
          $.extend(jqGridParams, {
            datatype: "jsonstring",
            datastr: {
              page: 1,
              records: data.length,
              rows: data
            },
            jsonReader: {
              repeatitems: false
            }
          });
        }
        if (!options.loadDataOnStart) {
          $.extend(jqGridParams, {
            datatype: "local"
          });
        }
        if (options.defaultSort != null) {
          $.extend(jqGridParams, {
            sortname: options.defaultSort.field,
            sortorder: options.defaultSort.direction || "asc"
          });
        }
        if (options.tree != null) {
          if (options.tree === true) {
            options.tree = {};
          }
          options.tree.columnName = (ko.utils.arrayFirst(columns, function(column) {
            return column.hidden == null;
          })).name;
          $.extend(jqGridParams, {
            treeGrid: true,
            ExpandColumn: options.tree.columnName,
            ExpandColClick: true,
            treeGridModel: 'adjacency',
            treeReader: {
              parent_id_field: options.tree.parent || "parent",
              expanded_field: options.tree.expanded || "expanded"
            }
          });
        }
        if (options.filter != null) {
          if (options.filter.subscribe != null) {
            options.filter.subscribe((function(_this) {
              return function() {
                return $(element).trigger("reload");
              };
            })(this));
          }
          rules = [];
          filterData = options.filter();
          for (field in filterData) {
            isArray = $.isArray(filterData[field]);
            operator = isArray ? 'in' : 'cn';
            data = isArray ? JSON.stringify(filterData[field]) : filterData[field];
            rules.push({
              field: field,
              data: data,
              op: operator
            });
          }
          filters = {
            groupOp: "AND",
            rules: rules
          };
          if (element.filters != null) {
            filters.rules.push.apply(filters.rules, element.filters.toJqGridFilters().rules);
          }
          $.extend(jqGridParams, {
            postData: {
              filters: JSON.stringify(filters)
            }
          });
        } else if (element.filters != null) {
          $.extend(jqGridParams, {
            postData: {
              filters: JSON.stringify(element.filters.toJqGridFilters())
            }
          });
        }
        if ((element.filters != null) && (element.filters.subscribe != null)) {
          element.filters.subscribe((function(_this) {
            return function() {
              return $(element).trigger("reload");
            };
          })(this));
        }
        if (options.source.subscribe != null) {
          options.source.subscribe((function(_this) {
            return function() {
              return $(element).trigger("reload");
            };
          })(this));
        }
        if (options.rowattr != null) {
          $.extend(jqGridParams, {
            rowattr: options.rowattr
          });
        }
        if (options.sendAlso != null) {
          if (options.sendAlso.subscribe != null) {
            options.sendAlso.subscribe((function(_this) {
              return function() {
                return $(element).trigger("reload");
              };
            })(this));
          }
          if (jqGridParams.postData === void 0) {
            jqGridParams.postData = {};
          }
          _ref2 = options.sendAlso();
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            additionalData = _ref2[_j];
            $.extend(jqGridParams.postData, additionalData);
          }
        }
        if ((options.useBrandFilter != null) && options.useBrandFilter === true) {
          shell.selectedBrandsIds.subscribe((function(_this) {
            return function() {
              return $(element).trigger("reload");
            };
          })(this));
        }
        if ((options.useLicenseeFilter != null) && options.useLicenseeFilter === true) {
          shell.selectedLicenseesIds.subscribe((function(_this) {
            return function() {
              return $(element).trigger("reload");
            };
          })(this));
        }
        if ((options.multiselect != null) && options.multiselect === true) {
          $.extend(jqGridParams, {
            multiselect: true,
            onSelectAll: function(ids, allSelected) {
              return $(element).trigger("selectAllChange", {
                ids: ids,
                allSelected: allSelected
              });
            }
          });
        }
        table.jqGrid(jqGridParams);
        element.gridParam = (function(_this) {
          return function(paramName, value) {
            if (value != null) {
              return table.jqGrid("setGridParam", paramName, value);
            } else {
              return table.jqGrid("getGridParam", paramName);
            }
          };
        })(this);
        element.getRowData = (function(_this) {
          return function(id) {
            return table.jqGrid("getRowData", id);
          };
        })(this);
        element.showColumns = (function(_this) {
          return function(columns) {
            return table.showCol(columns);
          };
        })(this);
        element.hideColumns = (function(_this) {
          return function(columns) {
            return table.hideCol(columns);
          };
        })(this);
        element.setColumnTitle = (function(_this) {
          return function(columnName, columnTitle) {
            column = ko.utils.arrayFirst(columns, function(column) {
              return column.name === columnName;
            });
            if (column != null) {
              return table.jqGrid("setLabel", column.name, column.title = columnTitle);
            }
          };
        })(this);
        $(element).on("reload", function() {
          var reloadGridParams, _k, _len2, _ref3;
          reloadGridParams = {
            search: (options.filter != null) || (element.filters != null),
            page: 1
          };
          if ($(element)[0].gridData != null) {
            data = $(element)[0].gridData;
            reloadGridParams.datatype = "jsonstring";
            reloadGridParams.datastr = {
              page: 1,
              records: data.length,
              rows: data
            };
          } else {
            reloadGridParams.datatype = "json";
          }
          if (options.filter != null) {
            rules = [];
            filterData = options.filter();
            for (field in filterData) {
              isArray = $.isArray(filterData[field]);
              operator = isArray ? 'in' : 'cn';
              data = isArray ? JSON.stringify(filterData[field]) : filterData[field];
              rules.push({
                field: field,
                data: data,
                op: operator
              });
            }
            filters = {
              groupOp: "AND",
              rules: rules
            };
            if (element.filters != null) {
              filters.rules.push.apply(filters.rules, element.filters.toJqGridFilters().rules);
            }
            reloadGridParams.postData = {
              filters: JSON.stringify(filters)
            };
          } else if (element.filters != null) {
            reloadGridParams.postData = {
              filters: JSON.stringify(element.filters.toJqGridFilters())
            };
          }
          if (options.sendAlso != null) {
            if (reloadGridParams.postData === void 0) {
              reloadGridParams.postData = {};
            }
            _ref3 = options.sendAlso();
            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
              additionalData = _ref3[_k];
              $.extend(reloadGridParams.postData, additionalData);
            }
          }
          return table.jqGrid("setGridParam", reloadGridParams).trigger("reloadGrid");
        });
        if (options.tree != null) {
          $(".treeclick").each(function() {
            var level, nextLevel, nextTreeclick;
            level = Number($(this).parent().next().find("span").attr("level"));
            nextTreeclick = $(this).closest("tr").next("tr").find(".treeclick");
            nextLevel = Number(nextTreeclick.parent().next().find("span").attr("level"));
            if (nextLevel !== level + 1) {
              return $(this).removeClass("treeclick");
            }
          });
          $(".treeclick.tree-minus", element).addClass("fa fa-caret-down");
          $(".treeclick.tree-plus", element).addClass("fa fa-caret-right");
          $(".treeclick").click(treeclick = function() {
            var expanded, triangle;
            triangle = $(this).closest("td").find(".treeclick");
            expanded = triangle.hasClass("tree-minus");
            return triangle.removeClass("fa-caret-down fa-caret-right").addClass(expanded ? "fa-caret-down" : "fa-caret-right");
          }).parent().next().click(treeclick);
        }
        if (options.paging != null) {
          $(".ui-icon-seek-first", pager).addClass("fa fa-angle-double-left bigger-140");
          $(".ui-icon-seek-prev", pager).addClass("fa fa-angle-left bigger-140");
          $(".ui-icon-seek-next", pager).addClass("fa fa-angle-right bigger-140");
          $(".ui-icon-seek-end", pager).addClass("fa fa-angle-double-right bigger-140");
          $('<a class="btn btn-xs btn-round btn-primary"><i class="fa fa-refresh">').prependTo($("#" + pager[0].id + "_left")).click(function() {
            return $(element).trigger("reload");
          });
        }
        if (options.useResizeManager != null) {
          if (options.useResizeManager === true) {
            options.useResizeManager = {};
          }
          if (!element.id) {
            element.id = "grid_" + Math.random().toString().substr(2);
          }
          return (function(gridId, tableId, options) {
            var ResizeManager, previousCompositionCompleteEvent, previousDetachedEvent, resizeManager;
            ResizeManager = require("ResizeManager");
            resizeManager = null;
            previousCompositionCompleteEvent = viewModel.compositionComplete;
            viewModel.compositionComplete = function() {
              var params;
              params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              if (previousCompositionCompleteEvent != null) {
                previousCompositionCompleteEvent.call.apply(previousCompositionCompleteEvent, params);
              }
              resizeManager = new ResizeManager(tableId, gridId);
              if (options.height != null) {
                resizeManager.fixedHeight = options.height;
              }
              resizeManager.$collapsible = $(options.collapsible);
              return resizeManager.bindResize();
            };
            previousDetachedEvent = viewModel.detached;
            return viewModel.detached = function() {
              var params;
              params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              resizeManager.unbindResize();
              if (previousDetachedEvent != null) {
                previousDetachedEvent.call.apply(previousDetachedEvent, params);
              }
              viewModel.compositionComplete = previousCompositionCompleteEvent;
              return viewModel.detached = previousDetachedEvent;
            };
          })(element.id, table[0].id, options.useResizeManager);
        }
      };

      GridRendering.columnTitle = function(s) {
        if ((s || "").indexOf("app:") === 0) {
          return require("i18next").t(s);
        } else {
          return s;
        }
      };

      GridRendering.columnFormatter = function(column, data, viewModel, gridOptions) {
        return (function(_this) {
          return function(cellvalue, options, rowObject) {
            var field, html, i, level, rowData, _i, _len, _ref, _ref1, _ref2;
            rowData = rowObject;
            if (rowObject._id_ != null) {
              rowData = ko.utils.arrayFirst(data, function(d) {
                return typeof d === "object" && d["id"] === rowObject._id_;
              });
              if (rowData == null) {
                rowData = data[Number(rowObject._id_) - 1];
              }
            }
            if ((gridOptions.fields != null) && !rowData.fieldsMapped) {
              _ref = gridOptions.fields;
              for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                field = _ref[i];
                rowData[field] = rowData[i];
              }
              rowData.fieldsMapped = true;
            }
            html = (function(item, parent, root) {
              var attrName, attrValue, templateElement;
              templateElement = $("<div>" + column.template.trim() + "</div>");
              for (attrName in column) {
                attrValue = column[attrName];
                if (attrName.indexOf("data-") === 0) {
                  templateElement.attr(attrName, attrValue);
                }
              }
              _this.evaluateElementValues(templateElement, item, parent, root);
              return templateElement.html();
            })(rowData, data, viewModel);
            if (column.name === ((_ref1 = gridOptions.tree) != null ? _ref1.columnName : void 0)) {
              level = rowData[((_ref2 = gridOptions.tree) != null ? _ref2.level : void 0) || "level"];
              html = ("<span level='" + level + "' style='padding-right: 5px; padding-left: " + (level * 20) + "px;'></span>") + html;
            }
            return html;
          };
        })(this);
      };

      GridRendering.evaluateElementValues = function(element, item, parent, root) {
        var attr, childElement, dataPrefix, value, _i, _j, _len, _len1, _ref, _ref1, _results;
        dataPrefix = "data-";
        _ref = ko.utils.arrayFilter(element[0].attributes, function(a) {
          return a.name.indexOf(dataPrefix) === 0;
        });
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          value = this.evaluateExpression(attr.value, item, parent, root);
          if (value == null) {
            value = "";
          }
          if (attr.name !== ("" + dataPrefix + "value")) {
            element.attr(attr.name.substr(dataPrefix.length), String(value));
          } else {
            if (element[0].tagName === 'INPUT') {
              if (element.attr("type") === "checkbox") {
                element.attr("checked", Boolean(value));
              } else {
                element.val(String(value));
              }
            } else {
              element.html(String(value));
            }
          }
        }
        _ref1 = element.children().toArray();
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          childElement = _ref1[_j];
          _results.push(this.evaluateElementValues($(childElement), item, parent, root));
        }
        return _results;
      };

      GridRendering.evaluateExpression = function(expression, item, parent, root) {
        var value, __previous_$parent_value, __previous_$root_value;
        __previous_$root_value = window["$root"];
        __previous_$parent_value = window["$parent"];
        window.$root = root;
        window.$parent = parent;
        value = coffeeScript["eval"].call(item, expression);
        window.$root = __previous_$root_value;
        window.$parent = __previous_$parent_value;
        return value;
      };

      return GridRendering;

    })();
  });

}).call(this);
