class TreeMapper(object):
    def __init__(self, data_repository=None):
        self.color_map = {
            "Dead Animal Removal":"#FFB0AA",
            "Other":"#552900",
            "Homeless Encampment":"#427A82",
            "Single Streetlight Issue":"#D4726A",
            "Electronic Waste":"#69969C",
            "Feedback":"#82C38D",
            "Graffiti Removal":"#801D15",
            "Multiple Streetlight Issue":"#AA4139",
            "Metal/Household Appliances":"#D49D6A",
            "Illegal Dumping Pickup":"#804815",
            "Bulky Items":"#51A35F",
            "Report Water Waste":"#012E34"
        }
        self.data_reepository = data_repository
        pass

    def BroadMap(self):
        target_view = "top_request_by_nc"
        dataset = self.data_reepository.Read(target_view)
        treemap_data = {"title": "Broad 311 Calls Map", "color": "#000000", "children": []}

        for row in dataset:
            data_point = {"title": row[0], "color": self.color_map[row[1]], "size": row[2]}
            treemap_data["children"].append(data_point)

        return treemap_data

    def NCMap(self, NCName=None):
        target_view = "broad_call_volume"
        dataset = self.data_reepository.Read(target_view)
        treemap_data = {"title": "Zoomed 311 Calls Map", "color": "#000000", "children": []}
        print(NCName)
        for row in dataset:
            if row[1] == NCName:
                data_point = {"title": row[2], "color": self.color_map[row[2]], "size": row[0]}
                treemap_data["children"].append(data_point)

        return treemap_data
