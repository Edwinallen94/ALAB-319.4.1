router.get("/stats", async (req, res) => {
  try {
    let collection = await db.collection("grades");

    let result = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            total_learners: { $sum: 1 },
            learners_above_70: {
              $sum: {
                $cond: [{ $gt: ["$weighted_average", 70] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total_learners: 1,
            learners_above_70: 1,
            percentage_above_70: {
              $multiply: [
                { $divide: ["$learners_above_70", "$total_learners"] },
                100,
              ],
            },
          },
        },
      ])
      .toArray();

    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Error retrieving stats.");
  }
});

router.get("/stats/:id", async (req, res) => {
  try {
    let collection = await db.collection("grades");
    let classId = Number(req.params.id);

    let result = await collection
      .aggregate([
        {
          $match: { class_id: classId },
        },
        {
          $group: {
            _id: "$class_id",
            total_learners: { $sum: 1 },
            learners_above_70: {
              $sum: {
                $cond: [{ $gt: ["$weighted_average", 70] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total_learners: 1,
            learners_above_70: 1,
            percentage_above_70: {
              $multiply: [
                { $divide: ["$learners_above_70", "$total_learners"] },
                100,
              ],
            },
          },
        },
      ])
      .toArray();

    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Error retrieving stats for the class.");
  }
});
