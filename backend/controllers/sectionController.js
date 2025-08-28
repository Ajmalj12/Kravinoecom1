import sectionModel from "../models/sectionModel.js";

export const listSections = async (req, res) => {
  try {
    const { page } = req.query;
    const query = page ? { page } : {};
    const sections = await sectionModel.find(query).sort({ page: 1, order: 1 });
    res.json({ success: true, sections });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const upsertSection = async (req, res) => {
  try {
    const { page, component, title, active, order, settings } = req.body;
    if (!page || !component) return res.json({ success: false, message: "Missing page or component" });
    const section = await sectionModel.findOneAndUpdate(
      { page, component },
      { $set: { title, active, order, settings } },
      { new: true, upsert: true }
    );
    res.json({ success: true, section });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const reorderSections = async (req, res) => {
  try {
    const { page, orderings } = req.body; // [{component, order}]
    if (!page || !Array.isArray(orderings)) return res.json({ success: false, message: "Invalid payload" });
    await Promise.all(orderings.map(o => sectionModel.updateOne({ page, component: o.component }, { $set: { order: o.order } })));
    res.json({ success: true, message: "Reordered" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
}; 