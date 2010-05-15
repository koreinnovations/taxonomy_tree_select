// $Id$

Drupal.taxonomyTreeSelect = Drupal.taxonomyTreeSelect ? Drupal.taxonomyTreeSelect : {};

Drupal.behaviors.taxonomyTreeSelect = function(context) {
  if (vocabularies = Drupal.settings.taxonomyTreeSelect && Drupal.settings.taxonomyTreeSelect) {
    var $form = $("#node-form", context),
    $wrapper;

    if (vocabularies && $form.length) {
      $.each(vocabularies, function(i) {
        var vocabulary = vocabularies[i];

        if (!vocabulary.terms) {
          return;
        }
        
        var $wrapper = $("#edit-taxonomy-" + vocabulary.id + "-wrapper");
        var $select = $("#edit-taxonomy-" + vocabulary.id);

        var listId = "taxonomy-" + vocabulary.id + "-tree";
        var list = Drupal.taxonomyTreeSelect.BuildList(vocabulary.terms);
        var classes = vocabulary.classes ? vocabulary.classes : [];
        classes.push("taxonomy-tree");
        
        list = "<div id='" + listId + "' class='" + classes.join(" ") + "'>" + list + "</div>";

        $select.hide();
        $wrapper.append(list);
        var $list = $("#" + listId);
        var $items = $list.find("label");
        var $expansables = $list.find("li.expansable");

        $list
          .bind("click", function(e) {
            var $target = $(e.target);
            var multiple = e.ctrlKey && vocabulary.multiple;

            if ($target.is("li")) {
              var target = "li";
              var $item = $target;
            }
            else if ($target.is("label")) {
              var target = "label";
              var $item = $target.parent("li");
            }

            switch (target) {
              case "label":
                var labelFor = $target.attr("for");

                if (!multiple) {
                  $list.find(".active").removeClass("active");
                  $select.find("option[selected]").removeAttr("selected");
                }

                if (multiple && $target.is(".active")) {
                  $target.removeClass("active");
                  $select.find("option[value='" + labelFor + "']").removeAttr("selected");
                }
                else {
                  $target.addClass("active");
                  $select.find("option[value='" + labelFor + "']").attr("selected", "selected");
                }
              case "li":
                var $child = $item.children("ul");

                if ($child.length && $child.is(":visible") && !multiple) {
                  $item.trigger("collapse");
                }
                else if ($child.length && !$child.is(":visible")) {
                  $item.trigger("expand");
                }
            }
          });

        $items
          .bind("sync", function(e) {
            var $label = $(this);
            if (!$label.is("label")) {
              return;
            }
            var labelFor = $label.attr("for");
            var state = $select.find("option[value='" + labelFor + "']").attr("selected");

            if (state) {
              $label.addClass("active");
            }
            else {
              $label.removeClass("active");
            }
          });

        $expansables
          .bind("init", function(e) {
            var $item = $(this);
            if ($item.find(".active").length) {
              $item.trigger("expand");
            }
          })
          .bind("collapse", function() {
            var $item = $(this);
            var $child = $item.children("ul");
            $child.slideUp("fast");
            $item
              .removeClass("expanded")
              .addClass("collapsed");
          })
          .bind("expand", function() {
            var $item = $(this);
            var $child = $item.children("ul");
            $child.slideDown("fast");
            $item
              .removeClass("collapsed")
              .addClass("expanded");
          })
          .children("ul").hide();

        $items.trigger("sync");
        $expansables.trigger("init");
      });
    }
  }
};

Drupal.taxonomyTreeSelect.BuildList = function(terms) {
  var list = "<ul class='menu'>";
    $.each(terms, function(i, term) {
      var classes = [];
      if (term.terms) {
        classes.push("collapsed");
        classes.push("expansable");
      }
      else {
        classes.push("leaf");
      }
      list += "<li id='taxonomy-tree-tid-" + term.tid + "' class='" + classes.join(" ") + "'>";
      list += "<label for='" + term.tid + "' id='edit-taxonomy-tree-tid-" + term.tid + "-link'>" + term.name + "</label>";
      if (term.terms) {
        list += Drupal.taxonomyTreeSelect.BuildList(term.terms);
      }
      list += "</li>";
    });
  list += "</ul>";

  return list;
};