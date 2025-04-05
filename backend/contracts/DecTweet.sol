// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./LikeToken.sol";

contract DecTweet {
    LikeToken public likeToken;

    struct Post {
        address author;
        string contentHash;
        uint256 likeCount;
        uint256 timestamp;
    }

    Post[] public posts;
    mapping(uint256 => mapping(address => bool)) public liked;

    event NewPost(uint256 indexed postId, address indexed author, string contentHash, uint256 timestamp);
    event Liked(uint256 indexed postId, address indexed liker);

    constructor(address _likeToken) {
        likeToken = LikeToken(_likeToken);
    }

    function createPost(string calldata _contentHash) external {
        posts.push(Post(msg.sender, _contentHash, 0, block.timestamp));
        emit NewPost(posts.length - 1, msg.sender, _contentHash, block.timestamp);
    }

    function likePost(uint256 _postId) external payable {
        require(!liked[_postId][msg.sender], "Already liked");
        require(_postId < posts.length, "Invalid post");

        liked[_postId][msg.sender] = true;
        posts[_postId].likeCount += 1;

        // Send tip to author (optional)
        if (msg.value > 0) {
            payable(posts[_postId].author).transfer(msg.value);
        }

        // Mint 10 LIKE tokens to liker
        likeToken.mint(msg.sender, 10 * 1e18);

        emit Liked(_postId, msg.sender);
    }

    function getAllPosts() external view returns (Post[] memory) {
        return posts;
    }
}
