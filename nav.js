"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// nav.js

// Add an event listener to the "submit" link in the navbar
$("#nav-submit").on("click", showAddStoryForm);

// Show the add story form and hide the story list
function showAddStoryForm(evt) {
  evt.preventDefault();
  storyList.hideStories();
  $("#add-story-form").show();
}

// in nav.js
async function navFavoritesClick(evt) {
  hidePageComponents();
  const favorites = await currentUser.getFavorites();
  putFavoriteStoriesOnPage(favorites);
  $favoriteStories.show();
}

// in stories.js
function putFavoriteStoriesOnPage(favorites) {
  $favoriteStories.empty();

  for (let story of favorites) {
    const $story = generateStoryMarkup(story);
    const $star = $story.find('.star-icon i');
    $star.removeClass('far').addClass('fas');
    $favoriteStories.append($story);
  }
}

