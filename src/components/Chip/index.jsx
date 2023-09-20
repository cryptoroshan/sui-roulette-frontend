import classNames from "classnames";

const Chip = (props) => {
  const { currentItemChips, currentItem, leftMin, leftMax, topMin, topMax } =
    props;

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  //console.log(chipsData);
  function getChipClasses(chip) {
    let cellClass = classNames({
      "chip-10-placed": chip === 10,
      "chip-5-placed": chip === 5,
      "chip-2-placed": chip === 2,
      "chip-1-placed": chip === 1,
      chipValueImage: true,
    });

    return cellClass;
  }

  if (currentItemChips !== undefined) {
    console.log("asdfsafdsafsafd");
    console.log(currentItemChips);
    let total = 0;
    let chipData = currentItemChips;
    const chipsImgs = [];
    let currentChipPlaced = 0;
    while (total < chipData.sum) {
      let currentChip = 100;
      let totalSum = chipData.sum - total;
      if (totalSum >= 50) {
        currentChip = 50;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 25) {
        currentChip = 25;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 10) {
        currentChip = 10;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 5) {
        currentChip = 5;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 2) {
        currentChip = 2;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else {
        currentChip = 1;
        let calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      }

      for (let i = 0; i < currentChipPlaced; i++) {
        let key =
          currentItem.type +
          "_" +
          currentItem.value +
          "_" +
          currentChip +
          "_" +
          i;
        //console.log(key);
        let style = {
          top: "50%",
          left: "20%",
        };
        style.left = "-7px";
        style.top = "-25px";
        console.log("chipsImgs", chipsImgs);
        chipsImgs.push(
          <div
            key={key}
            style={style}
            className={getChipClasses(currentChip)}
          ></div>
        );
      }
    }
    return <div className={"chipValue"}>{chipsImgs}</div>;
  } else {
    return <></>;
  }
};

export default Chip;
