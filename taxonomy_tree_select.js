
Drupal.behaviors.taxonomyTreeSelect = function(context) {
  var $form = $("#node-form", context),
      $taxonomyTrees = $form.find('ul.taxonomy-tree');

  $taxonomyTrees.each(function() {
    var $taxonomyTree = $(this),
        $inputs = $taxonomyTree.find('input'),
        $expansables = $taxonomyTree.find("li.expansable");

    $taxonomyTree
      // Attach the click event on the list to make use of event delegation
      .bind('click', function(event) {
        var $target = $(event.target).not('label'), // Ignoring label because it trigger a click to their 'input'
            $item = $target.is('li') ? $target : $target.parents('li:eq(0)'),
            $input = $item.find('input:eq(0)');

        if ($item.length && $item.is('.expansable')) {
          $item.trigger('toggle');
        }
        $inputs.trigger('sync');
      });

    $inputs
      // Syncronize checked/unchecked status of the fields with active/inactive classes
      .bind('sync', function() {
        var $input = $(this),
            $item = $input.parent('label').parent('div.form-item');

        if ($item.length) {
          if ($input.is(':checked')) {
            $item.addClass("active");
          }
          else {
            $item.removeClass("active");
          }
        }
      })
      // Run sync event when the page loads
      .trigger("sync");

    $expansables
      // Make sure all lists that have active children starts expanded
      .bind('init', function(e) {
        var $item = $(this);
        if ($item.find('.active').length) {
          $item.trigger('expand');
        }
      })
      // Collapse list
      .bind('collapse', function() {
        var $item = $(this),
            $child = $item.children('div.item-list').children('ul');
        $child.slideUp('fast');
        $item
          .removeClass('expanded')
          .addClass('collapsed');
      })
      // Expand list
      .bind('expand', function() {
        var $item = $(this),
            $child = $item.children('div.item-list').children('ul');
        $child.slideDown('fast');
        $item
          .removeClass('collapsed')
          .addClass('expanded');
      })
      // Expand or collapse
      .bind('toggle', function() {
        var $item = $(this),
            $child = $item.children('div.item-list').children('ul');
        if ($child.is(':visible')) {
          $item.trigger('collapse');
        }
        else {
          $item.trigger('expand');
        }
      })
      // Run init event when the page loads
      .trigger('init');
  });
};
