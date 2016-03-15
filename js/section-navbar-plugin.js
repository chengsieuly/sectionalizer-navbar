'use strict';

/**
 * This jQuery plugin will create the navigation bar according
 * to each section
 */
(function ($) {
  // Set Global variables
  let sections = []; // Iniate section array
  let $section = $('section.scrollable-section').toArray(); // Grab each section
  let sectionLength = $section.length;
  let sectionLengthArr = [];
  let sectionHeightArr = [];
  let offsetter = 300; // When to display active section helper
  let cur = $(window).scrollTop();

  /*
  * Iterates over each section and create navigation bar
  */
  for (let each in $section) {

    // Push information on each section to [sections] as objects
    sections.push({
        title: $($section[each]).data('section-title'),
        href: `${$($section[each]).data('section-title')}.section-${parseInt(each) + 1}`
      });

    // Push height information as array to work with navigation
    sectionHeightArr.push(($($section[each]).offset().top));
    sectionLengthArr.push(sectionHeightArr[each] - offsetter);

    setSectionID(each, $section); // Set ID for each section
    createNavBar(each, $section);  // Create navbar
    createSectionHeader(each); // Create header of each section
  }

  // Removes class active and set active class to the current target
  // in the navigation bar
  toggleActiveClass('a.nav-track');

  /**
   * Watches for scroll and window resize so navbar can
   * apply and remove active class accordingly
   */
  $.fn.sectionalized = () => {
    $(window).resize(() => {
      for (let i = 0; i < sectionLength; i++) {
        sectionHeightArr.push(($($section[i]).offset().top));
        sectionLengthArr.push(sectionHeightArr[i] - offsetter);
      }
    });

    $(document).scroll(() => {
      cur = $(window).scrollTop();
      for (let i = 0; i < sectionLength; i++) {
        sectionHeightArr[i] = ($($section[i]).offset().top);
        sectionLengthArr[i] = (sectionHeightArr[i] - offsetter);
        if (cur >= sectionLengthArr[i]) {
          $('a.nav-track').removeClass('active');
          $(`a.nav-track:eq(${i})`).addClass('active');
        }
      }
    });
  };

  /**
   * @description: Set id for each section
   * @param {number}: index     Indexes to the array of sections
   * @param {object}: $section  section object
   * @retrun {HTML}:            Set the ID attribute for each section
   */
  function setSectionID(index, $section) {
    $($section[index]).attr('id', sections[index].title);
  }

  /**
   * @description: Create the navigation bar and navigation links
   * @param {number}: index     Indexes to the array of sections
   * @param {object}: %section  section object
   * @return {HTML}:            Create the Navigation Bar and links
   */
  function createNavBar(index, $section) {
    // Create the navigation blueprint
    if (index === '0') {
      $('<nav class="bullets-container"><ul class="section-bullets"></ul></nav>').prependTo('body');
    }

    // Create the links
    $(`<li class="nav-track"><a class="nav-track" href=#${sections[index].href}>${sections[index].title}</a></li>`).appendTo('nav.bullets-container ul');
    $(`<a name=${sections[index].href}></a>`).prependTo($section[index]); // Create section refs

    // Positions the navbar
    if (index == (sectionLength - 1)) {
      // Makes sure the navigation bar is in the middle-right of the screen
      let centerNav = $('nav').height();
      $('nav.bullets-container').css('top', `calc((100% - ${centerNav}px)/2)`);

      // Set active class to the active menu
      for (let i = 0; i < sectionLength; i++) {
        if (cur >= sectionLengthArr[i]) {
          $('a.nav-track').removeClass('active');
          $(`a.nav-track:eq(${i})`).addClass('active');
        }
      }
    }
  }

  /**
   * Creates header for each section with data-section-title attr
   * @param {number}: index     Indexes to the array of sections
   * @return {HTML}:            Header for each section
   */
  function createSectionHeader (index) {
    $(`<h2>${sections[index].title}</h2>`).appendTo($section[index]);
  }

  /**
   * @description: Remove active class and adds active class to target
   * @param {element}: Any DOM element
   */
  function toggleActiveClass(element) {
    $(element).click((e) => {
      $(element).removeClass('active');
      $(e.target).addClass('active');
    });
  }
})( jQuery );