const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  console.log("Contact API called");
  try {
    const{
fullName,
email,
countryCode,
phone,
service,
subService,
message
}=req.body;

    if (
      !fullName ||
      !email ||
      !countryCode ||
      !phone ||
      !service ||
      !subService
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const newContact = await Contact.create({
fullName,
email,
countryCode,
phone,
service,
subService,
message
});

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const filter = search ? {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
        { subService: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ]
    } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "Read" },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getDashboardStats = async (req, res) => {
  try {

    const Contact = require("../models/Contact");

    const total = await Contact.countDocuments();

    const unread = await Contact.countDocuments({
      status: "Unread"
    });

    const read = await Contact.countDocuments({
      status: "Read"
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnquiries = await Contact.countDocuments({
      createdAt: {
        $gte: today
      }
    });

    const latest = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const conversionRate =
      total === 0
        ? 0
        : Math.round((read / total) * 100);

    res.json({
      success: true,
      stats: {
        total,
        unread,
        read,
        todayEnquiries,
        conversionRate
      },
      latest
    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};



module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
  getDashboardStats
};
