

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ForEventMenu } from "../screens/AfterAuth/InsideMenus/InsideGStyles";

const DatePicker = ({ onDateChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateInputValue, setDateInputValue] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDateTime = date ? date.toLocaleString(undefined, options) : 'No date selected';
    console.log('Formatted date and time:', formattedDateTime);
    setDateInputValue(formattedDateTime); // Update dateInputValue with formatted date and time
    onDateChange(formattedDateTime); // Pass formattedDateTime to the parent component
    hideDatePicker();
  };
  

  return (
    <View >
      <Text style={ForEventMenu.addEventLabels}> Date & Time </Text>
      <View style={{ flexDirection: 'row', alignItems:'center'  }}>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          style={styles.inputBox}
          datePickerContainerStyle={{ backgroundColor: "#6155E5" }}
        />
        <TextInput
          placeholder='dd/mm/yyyy'
          value={dateInputValue}
          onChangeText={setDateInputValue}
          editable={true} 
          style={ForEventMenu.inputBox}
          onTouchStart={showDatePicker}
          color='#f1f1f1'
          placeholderTextColor='#ABABAB'
        />
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={{color:'#ABABAB'}}> D&T Picker</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  
});

export default DatePicker;