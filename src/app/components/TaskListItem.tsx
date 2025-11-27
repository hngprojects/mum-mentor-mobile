// TaskListItem.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { colors, typography, spacing, fontFamilies } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

const tickChecked = require('../../assets/images/tick-square-checked.png');
const tickUnchecked = require('../../assets/images/tick-square.png');
const trashIcon = require('../../assets/images/trash.png');

interface TaskListItemProps {
  task: any;
  onToggleStatus: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
  onPress: () => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onToggleStatus,
  onDelete,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={onPress}
      disabled={task.status === 'completed'}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggleStatus(task.id, task.status)}
      >
        {task.status === 'completed' ? (
          <Image source={tickChecked} style={styles.checkboxImage} />
        ) : (
          <Image source={tickUnchecked} style={styles.checkboxImage} />
        )}
      </TouchableOpacity>

      {/* Task Content */}
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task.status === 'completed' && styles.taskTitleCompleted,
          ]}
          numberOfLines={1}
        >
          {task.name}
        </Text>
        {task.description && task.description.trim() !== '' && (
          <Text
            style={[
              styles.taskDescription,
              task.status === 'completed' && styles.taskDescriptionCompleted,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
        <Text style={styles.taskDateTime}>
          {format(parseISO(task.due_date), 'yyyy - MM - dd')} · {format(parseISO(task.due_date), 'h:mma')}
        </Text>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Image source={trashIcon} style={styles.trashIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: ms(spacing.md),
    paddingHorizontal: ms(spacing.md),
    backgroundColor: colors.textWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSubtle,
  },
  checkboxContainer: {
    marginRight: ms(spacing.sm + 4),
    paddingTop: ms(2),
  },
  checkboxImage: {
    width: ms(24),
    height: ms(24),
  },
  taskContent: {
    flex: 1,
    marginRight: ms(spacing.sm + 4),
  },
  taskTitle: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xs),
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textGrey2,
  },
  taskDescription: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: fontFamilies.regular,
    color: colors.textGrey1,
    marginBottom: ms(spacing.xs + 2),
    lineHeight: rfs(20),
  },
  taskDescriptionCompleted: {
    color: colors.textGrey2,
  },
  taskDateTime: {
    fontSize: rfs(typography.caption.fontSize),
    fontFamily: fontFamilies.regular,
    color: colors.textGrey2,
  },
  deleteButton: {
    padding: ms(spacing.xs),
  },
  trashIcon: {
    width: ms(20),
    height: ms(20),
  },
});

export default TaskListItem;