'use strict';

/**
 * This jQuery plugin will create the navigation bar according
 * to each section
 */
(function ($) {
  // Set Global variables
  let $sections = $('section.scrollable-section').toArray(); // Array of section elements
  let sectionsLength = $sections.length; // The number of sections
  let sectionHeights = []; // Array of height for each section
  let offsetter = 300; // This is subtracted from each height so switching between sections is smooth
  let cur = $(window).scrollTop(); // The distance from the current position to top
  let sectionProps = []; // Contain title and href properties of section to reuse

  /*
  * Iterates over each section and create navigation bar
  */
  for (let each in $sections) {

    // Push information on each section to [sections] as objects
    sectionProps.push({
        title: $($sections[each]).data('section-title'),
        href: `${$($sections[each]).data('section-title')}.section-${parseInt(each) + 1}`
      });

    // Calculates the x distance between the top of the section to 0
    // Then substracts it by the 'offsetter', which allows for a smooth transition
    sectionHeights.push($($sections[each]).offset().top - offsetter);

    setSectionID(each, $sections); // Set ID for each section
    createNavBar(each, $sections);  // Create navbar
    createSectionHeader(each); // Create section headers
    toggleActiveClass('a.nav-track'); // Toggles active class when clicked
  }


  /**
   * Watches for scroll and window resize so navbar can
   * apply and remove active class accordingly
   */
  $.fn.sectionalized = () => {
    $(window).resize(() => {
      for (let i = 0; i < sectionsLength; i++) {
        sectionHeights.push($($sections[i]).offset().top - offsetter);
      }
    });

    $(document).scroll(() => {
      cur = $(window).scrollTop();
      for (let i = 0; i < sectionsLength; i++) {
        sectionHeights[i] = ($($sections[i]).offset().top - offsetter);
        if (cur >= sectionHeights[i]) {
          $('a.nav-track').removeClass('active');
          $(`a.nav-track:eq(${i})`).addClass('active');
        }
      }
    });
  };

  /**
   * @description: Set id for each section
   * @param {number}: index     Indexes to the array of sections
   * @param {object}: $sections  section object
   * @retrun {HTML}:            Set the ID attribute for each section
   */
  function setSectionID(index, section) {
    $(section[index]).attr('id', sectionProps[index].title.toLowerCase());
  }

  /**
   * @description: Create the navigation bar and navigation links
   * @param {number}: index     Indexes to the array of sections
   * @param {object}: %section  section object
   * @return {HTML}:            Create the Navigation Bar and links
   */
  function createNavBar(index, section) {
    // Create the navigation blueprint
    if (index === '0') {
      $('<nav class="bullets-container"><ul class="section-bullets"></ul></nav>').prependTo('body');
    }

    // Create the navigation links
    $(`<li class="nav-track"><a class="nav-track" href=#${sectionProps[index].href}>${sectionProps[index].title}</a></li>`).appendTo('nav.bullets-container ul');
    $(`<a name=${sectionProps[index].href}></a>`).prependTo(section[index]); // Create section refs

    // Positions the navbar
    if (index == (sectionsLength - 1)) {
      // Makes sure the navigation bar is in the middle-right of the screen
      let centerNav = $('nav').height();
      $('nav.bullets-container').css('top', `calc((100% - ${centerNav}px)/2)`);

      // Set active class to the active menu
      for (let i = 0; i < sectionsLength; i++) {
        if (cur >= sectionHeights[i]) {
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
  function createSectionHeader(index) {
    $(`<h2>${sectionProps[index].title}</h2>`).appendTo($sections[index]);
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