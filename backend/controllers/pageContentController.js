import pageContentModel from "../models/pageContentModel.js";

export const listPageContent = async (req, res) => {
  try {
    const { page } = req.query;
    if (!page) return res.json({ success: false, message: "Missing page" });
    const items = await pageContentModel.find({ page });
    res.json({ success: true, items });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const upsertPageContent = async (req, res) => {
  try {
    const { page, key, value } = req.body;
    if (!page || !key) return res.json({ success: false, message: "Missing page or key" });
    const doc = await pageContentModel.findOneAndUpdate(
      { page, key },
      { $set: { value, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
    res.json({ success: true, item: doc });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
}; 