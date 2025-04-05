import { ethers } from "hardhat";

async function main() {
  const LikeTokenFactory = await ethers.getContractFactory("LikeToken");
  const likeToken = await LikeTokenFactory.deploy();
  await likeToken.waitForDeployment();
  const likeTokenAddress = await likeToken.getAddress();
  console.log("LikeToken deployed to:", likeTokenAddress);

  const TwitterFactory = await ethers.getContractFactory("DecenTweet");
  const twitter = await TwitterFactory.deploy(likeTokenAddress);
  await twitter.waitForDeployment();
  const twitterAddress = await twitter.getAddress();
  console.log("DecentraTweet deployed to:", twitterAddress);

  // Transfer ownership of LIKE token to the tweet contract
  const likeTokenTyped = await ethers.getContractAt(
    "LikeToken",
    likeTokenAddress
  );
  await likeTokenTyped.transferOwnership(twitterAddress);

  console.log("Ownership of LIKE transferred to DecentraTweet");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
