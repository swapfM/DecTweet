import { ethers } from "hardhat";
import { expect } from "chai";

describe("DecTweet", () => {
  let likeToken: any;
  let tweetContract: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const LikeToken = await ethers.getContractFactory("LikeToken");
    likeToken = await LikeToken.connect(owner).deploy();
    await likeToken.waitForDeployment();

    const DecentraTweet = await ethers.getContractFactory("DecTweet");
    tweetContract = await DecentraTweet.deploy(await likeToken.getAddress());
    await tweetContract.waitForDeployment();

    await likeToken
      .connect(owner)
      .transferOwnership(await tweetContract.getAddress());
  });

  it("should allow creating a post", async () => {
    await tweetContract.connect(user1).createPost("ipfs://test-content");
    const post = await tweetContract.posts(0);
    expect(post.author).to.equal(user1.address);
    expect(post.contentHash).to.equal("ipfs://test-content");
  });

  it("should mint LIKE tokens when user likes a post", async () => {
    await tweetContract.connect(user1).createPost("ipfs://abc");
    await tweetContract.connect(user2).likePost(0);

    const balance = await likeToken.balanceOf(user2.address);
    expect(balance.toString()).to.equal(ethers.parseEther("10").toString());
  });

  it("should not allow liking the same post twice", async () => {
    await tweetContract.connect(user1).createPost("ipfs://abc");
    await tweetContract.connect(user2).likePost(0);

    await expect(tweetContract.connect(user2).likePost(0)).to.be.revertedWith(
      "Already liked"
    );
  });

  it("should only allow DecentraTweet to mint", async () => {
    await expect(
      likeToken.connect(user1).mint(user2.address, 100)
    ).to.be.revertedWithCustomError(likeToken, "OwnableUnauthorizedAccount");
  });
});
