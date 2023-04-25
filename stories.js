"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// stories.js

// Add an event listener to the "submit" button in the add story form
$("#add-story-form").on("submit", submitStory);

// Submit the new story to the server and add it to the page
async function submitStory(evt) {
  evt.preventDefault();

  // Get the data from the form
  let title = $("#title").val();
  let author = $("#author").val();
  let url = $("#url").val();

  // Add the new story to the server
  let newStory = await storyList.addStory(currentUser, {title, author, url});

  // Add the new story to the page
  let $li = $("<li>");
  $li.append($("<a>").attr("href", newStory.url).text(newStory.title));
  $li.append($("<small>").text(` by ${newStory.author}`));
  $li.append($("<small>").addClass("pull-right").text(`posted by ${newStory.user.username}`));
  $("#all-stories-list").prepend($li);

  // Reset the form and hide it
  $("#add-story-form")[0].reset();
  $("#add-story-form").hide();

  // Show the story list again
  storyList.showStories();
}

// in stories.js
$allStoriesList.on("click", ".star-icon", async function (evt) {
  if(currentUser){
    const $star = $(evt.target);
    const $story = $star.closest('.story');
    const storyId = $story.attr("data-story-id");
    const story = storyList.stories.find(s => s.storyId === storyId);

    if(currentUser.isFavorite(story)){
      await currentUser.removeFavorite(story);
      $star.html('<i class="far fa-star"></i>');
    } else {
      await currentUser.addFavorite(story);
      $star.html('<i class="fas fa-star"></i>');
    }
  }
});

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